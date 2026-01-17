import { createSystemConfig } from "./config";
import { System } from "./services/System";

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