export const layout_dev = false;
export const items = [
    {id:1, name:'明信片（款A）', price:10, 'description':'postcard', thumbnail:'https://media.istockphoto.com/id/828156368/de/foto/demo.jpg?s=612x612&w=0&k=20&c=jT1TzYO-5XJYjUByI-G12oATtB6yO8QXcm1iesvlKTA=', 'inventory': 50, 'status': 1},
    {id:2, name:'明信片（款B）', price:15, 'description':'B4 size', thumbnail:'https://www.shutterstock.com/image-photo/word-demo-appearing-behind-torn-260nw-1782295403.jpg', 'inventory': 1, 'status': 1},
    {id:3, name:'貼紙', price:30, 'description':'', thumbnail:'https://static.wixstatic.com/media/ed70df_b5f46dcbb55f49b2bb27550accacca05~mv2.jpg/v1/fill/w_640,h_478,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/ed70df_b5f46dcbb55f49b2bb27550accacca05~mv2.jpg', 'inventory': 0, 'status': 1},
    {id:4, name:'貼紙（小）', price:25, 'description':'7x7cm', thumbnail:'https://mydeermoon.com/cdn/shop/files/image_fd85722f-d5bd-416e-98b8-67f0ce5f92b4.png?v=1692945697', 'inventory': 50, 'status': 0},
    {id:5, name:'加購', price:1, 'description':'', thumbnail:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRppnVRGfKkfeXXBHZxfR-2bdiQ4mLofWwrgQ&usqp=CAU', 'inventory': 50, 'status': 1}
]
/*CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price DECIMAL, inventory INT, description TEXT, thumbnail TEXT, status INT)*/
/*INSERT INTO items(`id`, `name`, `price`, `description`, `thumbnail`, `inventory`, `status`)
VALUES (1, '明信片（款A）', 10, 'postcard', 'https://media.istockphoto.com/id/828156368/de/foto/demo.jpg?s=612x612&w=0&k=20&c=jT1TzYO-5XJYjUByI-G12oATtB6yO8QXcm1iesvlKTA=', 50, 1),(2, '明信片（款B）', 15, 'B4 size', 'https://www.shutterstock.com/image-photo/word-demo-appearing-behind-torn-260nw-1782295403.jpg', 1, 1),(3, '貼紙', 30, '', '"https://static.wixstatic.com/media/ed70df_b5f46dcbb55f49b2bb27550accacca05~mv2.jpg/v1/fill/w_640,h_478,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/ed70df_b5f46dcbb55f49b2bb27550accacca05~mv2.jpg"', '0', '1'), (4, '貼紙（小）', 25, '7x7cm', 'https://mydeermoon.com/cdn/shop/files/image_fd85722f-d5bd-416e-98b8-67f0ce5f92b4.png?v=1692945697', 50, 0), (5, '加購', 1, '', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRppnVRGfKkfeXXBHZxfR-2bdiQ4mLofWwrgQ&usqp=CAU', 50, 1);*/

export const orders = [
    {'id':1, 'description':'na', 'status': 1, 'created_at': '2023-10-27T15:36:56.200'},
    {'id':2, 'description':'', 'status': 1, 'created_at': '2023-10-27T17:30:00.200'}
]
/*CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, status INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)*/
/*INSERT INTO orders(`id`, `description`, `status`, `created_at`)
VALUES(1, 'na', 1, '2023-10-27T15:36:56.200'),(2, '', 1, '2023-10-27T17:30:00.200')*/

export const order_detail = [
    {'order_id':1, 'item_id':1, 'qty': 1, 'unit_price': 10},
    {'order_id':1, 'item_id':2, 'qty': 1, 'unit_price': 15},
    {'order_id':1, 'item_id':3, 'qty': 1, 'unit_price': 20},
    {'order_id':1, 'item_id':5, 'qty': 20, 'unit_price': 1},
    {'order_id':2, 'item_id':5, 'qty': 20, 'unit_price': 1},
    {'order_id':2, 'item_id':3, 'qty': 2, 'unit_price': 15},
    {'order_id':2, 'item_id':4, 'qty': 2, 'unit_price': 25},
]
/*CREATE TABLE IF NOT EXISTS order_detail (order_id INTEGER, item_id INTEGER, qty INT, unit_price INT)*/
/*INSERT INTO order_detail(`order_id`, `item_id`, `qty`, `unit_price`)
VALUES (1, 1, 1, 10),(1, 2, 1, 15),(1, 3, 1, 20),(1, 5, 20, 1),(2, 5, 20, 1),(2, 3, 2, 15),(2, 4, 2, 25);*/

export const event_log = [
    {'id':1, 'code':'item_1', 'message': 'messageeeee', 'created_at': '2023-11-10 19:25:41'},
    {'id':2, 'code':'item_1', 'message': 'messageeeee', 'created_at': '2023-11-10 19:25:41'},
    {'id':3, 'code':'item_1', 'message': 'messageeeee', 'created_at': '2023-11-10 19:25:41'},
    {'id':4, 'code':'item_1', 'message': 'messageeeee', 'created_at': '2023-11-10 19:25:41'},
    {'id':5, 'code':'item_1', 'message': 'messageeeee', 'created_at': '2023-11-10 19:25:41'},
];
/*CREATE TABLE IF NOT EXISTS event_log (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)*/