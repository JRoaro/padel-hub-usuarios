import fetchAPI from './apiConstants';

class ReservacionesRepository {
    static async getHomeData() {
        return await fetchAPI('/api/cliente/home');
    }

    static async getReservaciones() {
        return await fetchAPI('/api/cliente/reservaciones');
    }

    static async getReservacion(id) {
        return await fetchAPI(`/api/cliente/reservaciones/${id}`);
    }

    static async getDatosCrearReservacion(data) {
        return await fetchAPI('/api/cliente/reservaciones/create',
            {
                method: "POST",
                body: JSON.stringify(data)
            },
        );
    }

    static async createReservacion(reserva) {
        return await fetchAPI('/api/cliente/reservaciones', {
            method: "POST",
            body: JSON.stringify(reserva)
        });
    }

    static async cancelarReservacion(id) {
        return await fetchAPI(`/api/cliente/reservaciones/${id}`, {
            method: "DELETE"
        });
    }

    static async unirseReservacion(id) {
        return await fetchAPI(`/api/cliente/reservaciones/${id}/unirse`, {
            method: "POST"
        });
    }
}

export default ReservacionesRepository;