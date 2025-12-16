import ServerStatusController from './ServerStatusController'
import UuidConverterController from './UuidConverterController'

const Tools = {
    ServerStatusController: Object.assign(ServerStatusController, ServerStatusController),
    UuidConverterController: Object.assign(UuidConverterController, UuidConverterController),
}

export default Tools