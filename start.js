"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
// Set the port
const port = 3000;
// Start the server
server_1.default.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
