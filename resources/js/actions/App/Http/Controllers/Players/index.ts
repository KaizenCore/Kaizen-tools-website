import PlayerController from './PlayerController'
import PlayerReportController from './PlayerReportController'

const Players = {
    PlayerController: Object.assign(PlayerController, PlayerController),
    PlayerReportController: Object.assign(PlayerReportController, PlayerReportController),
}

export default Players