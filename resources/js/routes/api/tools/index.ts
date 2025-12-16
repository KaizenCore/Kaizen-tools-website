import serverStatus from './server-status'
import uuidConverter from './uuid-converter'

const tools = {
    serverStatus: Object.assign(serverStatus, serverStatus),
    uuidConverter: Object.assign(uuidConverter, uuidConverter),
}

export default tools