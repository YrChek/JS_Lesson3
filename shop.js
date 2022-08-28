class Good {
    constructor (id, name, description, sizes, price) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = true;
    }

    setAvailable() {
        this.available = !this.available;
    };
}

class GoodsList {
    static #goods = []
    static listID = []
    constructor (filter = '', sortPrice = false, sortDir = true) {
        this.filter = filter;
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    } 

    add(id, name, description, sizes, price) {
        let chekID = GoodsList.listID.includes(id)
        if (chekID) {
            console.log(`Инденификатор (id = ${id}) уже существует`);
            return false
        } else {
            const exemplar = new Good(id, name, description, sizes, price);
            GoodsList.#goods.push(exemplar);
            GoodsList.listID.push(id);
            return exemplar
        }
    }

    get list () {
        const getAvailable = GoodsList.#goods.filter((good) => good.available);
        let regexp = new RegExp(this.filter, 'i');
        const getGoods = getAvailable.filter((good) => regexp.test(good.name));
        if (this.sortPrice) {
            if (this.sortDir) {
                getGoods.sort((a, b) => a.price - b.price);
            } else {
                getGoods.sort((a, b) => b.price - a.price);
            }
        }
        return getGoods
    }

    delGood(id) {
        let del = GoodsList.listID.indexOf(id);
        GoodsList.#goods.splice(del, 1);
        GoodsList.listID.splice(del, 1);
    }

}


const product = new GoodsList()
const jacket1 = product.add(1, 'куртка', 'кожанная', 56, 5000)
const slacks = product.add(2, 'брюки', 'классические', [45, 48], 1500)
const boots = product.add(3, 'ботинки', 'черные', 44, 3500)
const jacket2 = product.add(4, 'куртка', 'ветровка', 48, 1300)
const jacket3 = product.add(5, 'Куртка', 'болоний', 48, 1400)

jacket2.setAvailable()

const delGoods = new GoodsList()
delGoods.delGood(5)

const filterGoods = new GoodsList('куртка', true, false)
filterProduct = filterGoods.list

// console.log(filterProduct)



class BasketGood extends Good {
    constructor(good, amount, id, name, description, sizes, price, available) {
        super(id, name, description, sizes, price, available);
        this.id = good.id;
        this.name = good.name;
        this.description = good.description;
        this.sizes = good.sizes;
        this.price = good.price;
        this.available = good.available;
        this.amount = amount;
    }
}

class Basket {
    constructor(good, amount) {
        this.goods = [];
        this.basketListID = [];
        this.add(good, amount);
    }

    add(good, amount) {
        let chekID = this.basketListID.includes(good.id);
        if (chekID) {
            let idu = this.basketListID.indexOf(good.id);
            this.goods[idu].amount += amount;
        } else {
            this.goods.push(new BasketGood(good, amount));
            this.basketListID.push(good.id);
        }
    }

    remove(good, amount){
        let chekID = this.basketListID.includes(good.id);
        if (chekID) {
            let idu = this.basketListID.indexOf(good.id);
            this.goods[idu].amount -= amount;
            const count = this.goods[idu].amount;
            if (count <= 0) {
                this.goods.splice(idu, 1);
                this.basketListID.splice(idu, 1);
            }
        } else {
            console.log('Такой товар в корзине отсутствует')
        }
    }

    clear() {
        this.goods = [];
        this.basketListID = [];
    }

    removeUnavailable() {
        let sortGoods = this.goods.filter((good) => !good.available);
        sortGoods.forEach((element) => {
            let del = this.goods.indexOf(element);
            this.goods.splice(del, 1);
            this.basketListID.splice(del, 1);
        })
    }

    get totalSum() {
        const sum = this.goods.reduce((total, amount2) => {
            total += amount2.amount;
            return total
            }, 0);
        return sum
    }

    get totalAmount() {
        let total = 0;
        this.goods.forEach((good) => total += good.amount * good.price);
        return total
    }
}

const userBasket1 = new Basket(slacks, 3)
userBasket1.add(jacket3, 4)
userBasket1.remove(jacket3, 4)

const userBasket2 = new Basket(jacket2, 1)
userBasket2.add(jacket2, 1)
userBasket2.add(boots, 2)
userBasket2.removeUnavailable()
// userBasket2.clear()

console.log(userBasket2.totalSum)
console.log(userBasket2.totalAmount)