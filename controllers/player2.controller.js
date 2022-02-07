const axios = require("axios");
const fs = require("fs");
const path = require("path");
const generateGridData = require("../helpers/generateGrid");
const gridPositions = require('../helpers/gridpositions');
const shotPositions = require('../helpers/shotPoisition');

const AppError = require('../Error/appError');
const catchAsync = require('../helpers/catchAsync');

var serverStatus = 'IDLE';

var grid;
var grid1 = {};

const getLogTime = () => {
    let now = new Date();
    let addZeroIf = (data) => {
        data = data.toString()
        return data.length === 1 
        ? `0${data}` 
        : data
    }
    return `${addZeroIf(now.getHours())}:${addZeroIf(now.getMinutes())}:${addZeroIf(now.getSeconds())}`;
};

const sendEvent = (req, event) => {
    const io1 = req.app.get("socketP1");
    const io2 = req.app.get("socketP2");

    if (event.player === "P1") {
        io1.sockets.emit("eventsPlayer1", event);
        io2.sockets.emit("eventsPlayer1", event);
    } else {
        io1.sockets.emit("eventsRivalPlayer", event);
        io2.sockets.emit("eventsRivalPlayer", event);
    }
};

const getRivalApi = (req, res) => {
    try {
        sendEvent(req, { player: "P2", status: serverStatus });
        res.send("OK");
    } catch (error) {
        res.send(error.message);
    }
};

const postChallenge = async (req, res) => {
    try {
        if (req.body.msg === "lets play" && serverStatus === "IDLE") {
            serverStatus = "THINKING RULES";
            sendEvent(req, {
                player: "P2",
                status: serverStatus,
                msg: `${getLogTime()} - You accepted a new challenge!`,
            });
            sendEvent(req, {
                player: "P2",
                status: serverStatus,
                msg: `${getLogTime()} - Please send the rules to your oponent.`,
            });
            res.status(200).json({
                status: "SUCCESS",
            });
        } else {
            throw new Error("Server not prepared or msg incorrect");
        }
    } catch (error) {
        console.log("error on postChallangeP2");
        console.log(error.message);
    }
};

const postRules = async (req, res) => {
    try {
        const { rules } = req.body;
        const reqPathRules = path.join(__dirname, '../uploads/rules.txt');
        const resp = await axios.post("http://localhost:3001/player1/rules", {
            rules,
        });

        fs.writeFileSync(reqPathRules, JSON.stringify(rules.ships));

        if (resp.data.status === "SUCCESS") {
            serverStatus = "SETTING UP";
            grid = generateGridData(rules.width, rules.height);

            sendEvent(req, {
                player: "P2",
                status: serverStatus,
                msg: `${getLogTime()} - You have sent the rules to your oponent.`,
            });

            sendEvent(req, {
                player: "P2",
                status: serverStatus,
                msg: `${getLogTime()} - Please position your boats.`,
            });

            res.status(200).send("OK");
        } else {
            throw new Error("Failed to deliver the rules");
        }
    } catch (error) {
        console.log("P2", error.message);
        res.status(404);
    }
};

const postReady = async (req, res) => {
    try {
        let { positions } = req.body;

        const reqPath = path.join(__dirname, "../uploads/positionP2.txt");

        if (serverStatus === "RIVAL WAITING" || serverStatus === "SETTING UP") {
            serverStatus = "PROCESSING PLACEMENT";

            sendEvent(req, {
                player: "P2",
                status: serverStatus,
            });

            grid1 = generateGridData();
            
            let finalGrid = gridPositions(grid1, positions);

            const saveRulesGrid = {
                grid: finalGrid, 
                barcosTotales: positions
            };

            sendEvent(req, {
                player: "P2",
                status: serverStatus,
                msg: `${getLogTime()} - You have uploaded the positions to your grid.`,
            });

            serverStatus = "SENDING SHOT";

            sendEvent(req, {
                player: "P2",
                status: serverStatus,
                msg: `${getLogTime()} - Please proceed to shoot your enemy.`,
            });

            fs.writeFileSync(reqPath, JSON.stringify(saveRulesGrid));

            res.status(200).send("OK");
        } else {
            throw new Error("Server is not on the mood");
        }
    } catch (error) {
        console.log("P2", error.message);
        res.status(404).send(error);
    }
};

const postShot = async (req, res) => {
    try {
        const io = req.app.get("socketio");

        const { X, Y } = req.params;
        if (typeof X === "undefined" || typeof Y === "undefined") {
            const { shot } = req.body;
            if (shot) {
                // soy atacado
                const reqPath = path.join(
                    __dirname,
                    "../uploads/positionP2.txt"
                );
                const data = fs.readFileSync(reqPath, "utf8");
                const response = shotPositions(
                    JSON.parse(data),
                    shot,
                    "Player 2"
                );

                io.sockets.emit("eventsRivalPlayer", {
                    msg: `Your opponent sent a shot to the coordinates ${shot}`,
                });
                res.json(response);
            }
        } else {
            // estoy atacando
            const { data } = await axios.post(
                `http://localhost:3001/player1/shot/`,
                {
                    shot: X + Y,
                }
            );
            io.sockets.emit("eventsRivalPlayer", {
                msg: `${data} at coordinates ${X + Y}`,
            });
            res.sendStatus(200);
        }
    } catch (error) {
        console.log(error.message);
    }
};

const postYield = async (req, res) => {
    serverStatus = "IDLE";

    const io = req.app.get("socketio");
    io.sockets.emit("eventsRivalPlayer", {
        msg: "You surrender :( ",
    });

    res.send("Finish game");
};

module.exports = {
    getRivalApi,
    postChallenge,
    postRules,
    postReady,
    postShot,
    postYield,
};
