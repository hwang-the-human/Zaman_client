// const server = 'https://infinite-eyrie-01907.herokuapp.com/';
const server = 'http://192.168.1.60:3000/';

const Api = {
  clients: {
    send_sms: server + 'api/clients/send_sms',
    send_sms_for_recovery_password:
      server + 'api/clients/send_sms_for_recovery_password',
    verify_sms: server + 'api/clients/verify_sms',
    verify_sms_for_recovery_password:
      server + 'api/clients/verify_sms_for_recovery_password',
    sign_up: server + 'api/clients/sign_up',
    sign_in: server + 'api/clients/sign_in',
    me: server + 'api/clients/me',
    save_device_token: server + 'api/clients/save_device_token',
    add_card: server + 'api/clients/add_card',
    remove_cards: server + 'api/clients/remove_cards',
    add_address: server + 'api/clients/add_address',
    remove_addresses: server + 'api/clients/remove_addresses',
    recover_password: server + 'api/clients/recover_password',
    remove_messages: server + 'api/clients/remove_messages',
  },
  restaurants: {
    get_list_of_restaurants_by_categories:
      server + 'api/restaurants/get_list_of_restaurants_by_categories',
    get_list_of_restaurants: server + 'api/restaurants/get_list_of_restaurants',
    get_list_of_restaurants_by_id:
      server + 'api/restaurants/get_list_of_restaurants_by_id',
    get_dishes_of_selected_restaurant:
      server + 'api/restaurants/get_dishes_of_selected_restaurant',
  },
  orders: {
    place_order: server + 'api/orders/place_order',
    get_order_history: server + 'api/orders/get_order_history',
  },
};

export default Api;
