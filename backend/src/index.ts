import 'dotenv/config';
import { createSystemConfig } from "./config.js";
import { System } from "./services/System.js";

const main = () => {
    const config = createSystemConfig(process.env); //process.env as unknown as SystemConfig;
    const system = new System(config);

    ['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(code => {
        process.on(code, () => {
            system.stop();
        });
    });

    system.start();
};

main();