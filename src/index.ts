import "./import-first";
import { container } from "@di/container";
import { App } from "./app";

const app = container.resolve(App);

app.listen();