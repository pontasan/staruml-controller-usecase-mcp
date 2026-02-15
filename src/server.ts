import { createServer, usecaseTools } from "staruml-controller-mcp-core"

export function createUsecaseServer() {
    return createServer("staruml-controller-usecase", "1.0.0", usecaseTools)
}
