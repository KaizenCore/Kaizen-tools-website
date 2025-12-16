import PlayerController from './PlayerController'
import ReportController from './ReportController'

const Admin = {
    PlayerController: Object.assign(PlayerController, PlayerController),
    ReportController: Object.assign(ReportController, ReportController),
}

export default Admin