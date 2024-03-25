const router = express.Router();

const {
  getProducts,
  createProduct
} = require('../controllers/products')

router.get('/', getProducts)
router.post('/', createProduct)

module.exports = router;