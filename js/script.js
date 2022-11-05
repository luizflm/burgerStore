// Initial Data
let cart = []
let modalQt = 1
let modalKey = 0

// Functions 
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

burgerJson.map((item, index) => {
    const burgerItem = document.querySelector('.models .burger--item').cloneNode(true);

    // filling info of any burger
    burgerItem.setAttribute('data-key', index);
    burgerItem.querySelector('.burger-item--name').innerHTML = item.name;
    burgerItem.querySelector('.burger-item--img img').src = item.img;
    burgerItem.querySelector('.burger-item--price').innerHTML = `$ ${item.price.toFixed(2)}`;
    burgerItem.querySelector('.burger-item--desc').innerHTML = item.description;

    // everytime that a burgerItem be/was clicked
    burgerItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        modalQt = 1

        // Which data-key burger was chosen?
        let key = e.target.closest('.burger--item').getAttribute('data-key');
        modalKey = key;

        // filling info of burger in windowArea
        c('.burgerWindowArea h1').innerHTML = burgerJson[key].name;
        c('.burgerWindowArea img').src = burgerJson[key].img;
        c('.burgerWindowArea .burgerInfo--desc').innerHTML = burgerJson[key].description;
        c('.burgerWindowArea .burgerInfo--actualPrice').innerHTML = `$ ${burgerJson[key].price.toFixed(2)}`;

        // filling info of frenchfries options
        c('.burgerInfo--ffOption.selected').classList.remove('selected');
        cs('.burgerInfo--ffOption').forEach((option, optionIndex) => {
            if(optionIndex == 0) {
                option.classList.add('selected')
            };
            if(optionIndex < 3 ) { // because the last ffoption has no span
                option.querySelector('span').innerHTML = `$ ${burgerJson[key].frenchfries.price[optionIndex]}`
            };
        });

        c('.burgerInfo--qt').innerHTML = modalQt;

        // creating an animation to show windowArea 
        c('.burgerWindowArea').style.opacity = 0;
        c('.burgerWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.burgerWindowArea').style.opacity = 1;
        }, 200);

    });

    // after filling info
    c('.burger--area').append( burgerItem );
});


const closeModal = () => {
    c('.burgerWindowArea').style.opacity = 0;
    setTimeout(() => { // burgerWindowArea has a transition of .5s in css, that's why i just can set display:none after 500ms 
        c('.burgerWindowArea').style.display = 'none';
    }, 500);
   
};


const updateCart = () => {
    c('.menu--openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        c('aside').classList.add('show')
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let discount = 0;
        let total = 0;

        cart.map((item, index) => {
            // Which is the burger?
            let burgerItem = burgerJson.find((item) => item.id == cart[index].id);
            subtotal += (burgerItem.price + burgerItem.frenchfries.price[item.ffOption]) * cart[index].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let burgerFfOptionName;
            switch(cart[index].ffOption) {
                case 0:
                burgerFfOptionName = 'BIG FF'
                break;
                case 1:
                burgerFfOptionName = 'MEDIUM FF'
                break;
                case 2:
                burgerFfOptionName = 'SMALL FF'
                break;
                case 3:
                burgerFfOptionName = 'NO FF'
                break;
            };
            let burgerName = `${burgerItem.name} (${burgerFfOptionName})`;

            cartItem.querySelector('img').src = burgerItem.img;
            cartItem.querySelector('.cart--item-name').innerHTML = burgerName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[index].qt

            cartItem.querySelector('.cart--item-qtless').addEventListener('click', () => {
                if(cart[index].qt > 1) {
                    cart[index].qt--
                } else {
                    cart.splice(index, 1) // removing cartItem of cart
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmore').addEventListener('click', () => {
                cart[index].qt++
                updateCart();
            });

           
            c('.cart').append(cartItem);
            
        });
        discount = subtotal * 0.1; // or subtotal / 10
        total = subtotal - discount;

        c('.subtotal span:last-child').innerHTML = `$ ${subtotal.toFixed(2)}`;
        c('.discount span:last-child').innerHTML = `$ ${discount.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `$ ${total.toFixed(2)}`;

    

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
    
   
};


// Events

cs('.burgerInfo--cancelBtn, .burgerInfo--cancelMobileBtn').forEach((item) => {
    item.addEventListener('click', closeModal)
});


c('.burgerInfo--qtless').addEventListener('click', () => {
    if(modalQt > 1) {
        modalQt--
        c('.burgerInfo--qt').innerHTML = modalQt;
    }
});
c('.burgerInfo--qtmore').addEventListener('click', () => {
    modalQt++
    c('.burgerInfo--qt').innerHTML = modalQt;
});

cs('.burgerInfo--ffOption').forEach((option, optionIndex) => {
    option.addEventListener('click', (e) => {
        c('.burgerInfo--ffOption.selected').classList.remove('selected');
        option.classList.add('selected');
    });
});

c('.burgerInfo--addBtn').addEventListener('click', () => {
    let ffOption = parseInt(c('.burgerInfo--ffOption.selected').getAttribute('data-key'));
    
    let identifier = burgerJson[modalKey].id+'@'+ffOption;

    let key = cart.findIndex( (item) => item.identifier == identifier);
    
    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:burgerJson[modalKey].id,
            ffOption,
            qt: modalQt,
        });
    };

    updateCart();
    closeModal();
    
});

c('.menu--openner').addEventListener('click', () => {
    if(cart.length > 0) {
        c('aside').style.left = '0'
    }
});

c('.menu--closer').addEventListener('click', () => {
    c('aside').style.left = '100vw'
});