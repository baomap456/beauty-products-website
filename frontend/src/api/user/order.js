import axios from '../axios'

const createOrder = (orderData) => {
    return axios.post('user/orders', orderData)
}

const getUserOrders = () => {
    return axios.get('user/orders')
}

const getOrderById = (orderId) => {
    return axios.get(`user/orders/${orderId}`)
}

export { createOrder, getUserOrders, getOrderById }