export const products = [

{
    
    name: 'hades like',
    description: 'hades te da su aprobacion',
    price: 500,
    stock: 3,
    category: 'nuevos',
    img: '/poco-un-poc (13).jpg'
},
{
    
    name: 'gengar',
    description: 'sprite de la primera generacion de pokemon',
    price: 500,
    stock: 3,
    category: 'mas-vendidos',
    img: '/poco-un-poc (3).jpg'
},
{
    
    name: 'bart Deadpool',
    description: 'Bart Simpson vestido de Deadpool',
    price: 500,
    stock: 2,
    category: 'mas-vendidos',
    img: '/poco-un-poc (7).jpg'
}
];

export const getProducts = () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(products), 2000);
    });
};

export const getProductById = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const product = products.find(prod => prod.id === id);
            product ? resolve(product) : reject('Producto no encontrado');
        }, 2000);
    });
};


