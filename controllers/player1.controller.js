const axios = require("axios");
const fs = require("fs");
const path = require("path");
const generateGridData = require("../helpers/generateGrid");
const gridPositions = require("../helpers/gridpositions");
const shotPositions = require("../helpers/shotPoisition");
const AppError = require("../Error/appError");
let serverStatus = "IDLE";
let grid;

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
const getPlayerApi = (req, res) => {
    try {
        sendEvent(req, { player: "P1", status: serverStatus });
        res.send("OK");
    } catch (error) {
        res.send(error.message);
    }
};

const postChallenge = async (req, res) => {
    try {
        sendEvent(req, {
            player: "P1",
            status: serverStatus,
            msg: `${getLogTime()} - You've sent a challenge to Player 2.`,
        });
        const resp = await axios.post(
            "http://localhost:3002/player2/challenge",
            {
                msg: "lets play",
            }
        );

        if (resp.data.status === "SUCCESS") {
            serverStatus = "WAITING RULES";
            sendEvent(req, {
                player: "P1",
                status: serverStatus,
                msg: `${getLogTime()} - Invitation accepted.`,
            });
            res.status(200).send("OK");
        } else {
            sendEvent(req, {
                player: "P1",
                status: serverStatus,
                msg: `${getLogTime()} - Your challenge was canceled due no response.`,
            });
            res.status(400).send("FAILED");
        }
    } catch (error) {
        console.log("error on postChallangeP1");
        console.log(error.message);
    }
};

const postRules = async (req, res) => {
    let rulesP2 = req.body.rules;
    try {
        if (
            Object.keys(rulesP2).length === 3 &&
            serverStatus === "WAITING RULES"
        ) {
            serverStatus = "SETTING UP";

            grid = generateGridData(rulesP2.width, rulesP2.heigth);

            sendEvent(req, {
                player: "P1",
                status: serverStatus,
                msg: `${getLogTime()} - Rules recieved successfully!`,
            });

            sendEvent(req, {
                player: "P1",
                status: serverStatus,
                msg: `${getLogTime()} - Please position your boats.`,
            });

            res.status(200).json({
                status: "SUCCESS",
            });
        } else {
            throw new Error("Rules incomplete");
        }
    } catch (error) {
        console.log("P1", error.message);
        res.status(404).send(error);
    }
};

const postInit = async (req, res) => {
    try {
        const { positions } = req.body;
        const reqPath = path.join(__dirname, "../uploads/positionP1.txt");

        if (serverStatus === "RIVAL WAITING" || serverStatus === "SETTING UP") {
            serverStatus = "PROCESSING PLACEMENT";

            sendEvent(req, {
                player: "P1",
                status: serverStatus,
            });

            grid = generateGridData();

            let finalGrid = gridPositions(grid, positions);

            serverStatus = "WAITING RIVAL";

            sendEvent(req, {
                player: "P1",
                status: serverStatus,
                msg: `${getLogTime()} - You have uploaded the positions to your grid.`,
            });

            const saveRulesGrid = {
                grid: finalGrid, 
                barcosTotales: positions
            };

            fs.writeFileSync(reqPath, JSON.stringify(saveRulesGrid))

            res.status(200).send("OK");
        } else {
            throw new Error("Server is not on the mood");
        }
    } catch (error) {
        console.log("P1", error.message);
        res.status(404).send(error);
    }
};

const postShot = async (req, res) => {
    // ------ Si yo golpeo ---------- Los params son verdaderos y validos
    // saco las coordenadas de los params
    // hago un llamado al rival con las coordenadas enviadas por body y el rival cambia su estado a preparing for shot
    // cambio mi estado a waiting for shot
    // recibo la respuesta y la muestro
    // ------ Si me golpean --------- El body es verdadero y valido
    // recibo las coordenadas por body
    // calculo si fui golpeado o no
    // cambio mi estado a preparing shot
    // respondo si golpeo o no

    try {
        const { X, Y } = req.params;

        if(typeof(X) === 'undefined' || typeof(Y) === 'undefined' ){
            const {shot} = req.body
            
            // ESTE PRIMER IF ESTA BIEN
            if (shot) {
                // soy atacado
                const reqPath = path.join(
                    __dirname,
                    "../uploads/positionP1.txt"
                );
                const data = fs.readFileSync(reqPath, "utf8");
                const response = shotPositions(
                    JSON.parse(data),
                    shot,
                    "Player 1"
                );

                sendEvent(req, {
                    player: "P1",
                    status: serverStatus,
                    msg: `${getLogTime()} - Your opponent sent a shot to the coordinates ${shot}.`,
                });

                res.json(response);
            }
        } else {
            // estoy atacando
            let {data} = await axios.post(`http://localhost:3002/player2/shot/`,{
                shot: X+Y
            })

            sendEvent(req, {
                player: "P1",
                status: serverStatus,
                msg: `${getLogTime()} - ${data} at coordinates ${X+Y}.`,
            });

            res.sendStatus(200)
        }
    } catch (error) {
        console.log(error.message);
    }
};

const postYield = async (req, res) => {
    serverStatus = "IDLE";

    sendEvent(req, {
        player: "P1",
        status: serverStatus,
        msg: `${getLogTime()} - You surrender :(.`,
    });

    res.send("Finish game");
};

module.exports = {
    getPlayerApi,
    postChallenge,
    postRules,
    postInit,
    postShot,
    postYield,
};
