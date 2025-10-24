import fetchAPI from './apiConstants';

class ReservacionesRepository {
    static async getHomeData() {
        return await fetchAPI('/api/cliente/home');
    }

    static async getReservaciones() {
        return await fetchAPI('/api/cliente/reservaciones');
    }

    static async getDatosCrearReservacion() {
        return await fetchAPI('/api/cliente/reservaciones/create');
    }

    static async createReservacion(reserva) {
        return await fetchAPI('/api/cliente/reservaciones', {
            method: "POST",
            body: JSON.stringify(reserva)
        }, true);
    }

    static async cancelarReservacion(id) {
        return await fetchAPI(`/api/cliente/reservaciones/${id}`, {
            method: "DELETE"
        }, true);
    }
}

export default ReservacionesRepository;