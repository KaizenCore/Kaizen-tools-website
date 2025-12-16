import ModController from './ModController'
import CategoryController from './CategoryController'

const Mods = {
    ModController: Object.assign(ModController, ModController),
    CategoryController: Object.assign(CategoryController, CategoryController),
}

export default Mods