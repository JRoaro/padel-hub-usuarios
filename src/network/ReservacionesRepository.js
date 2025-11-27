import fetchAPI from './apiConstants';

class ReservacionesRepository {
    static async getHomeData() {
        return await fetchAPI('/api/cliente/home');
    }

    static async getReservaciones() {
        return await fetchAPI('/api/cliente/reservaciones');
    }

    static async getReservacion(hash) {
        return await fetchAPI(`/api/cliente/reservaciones/${hash}`);
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

    static async cancelarReservacion(hash) {
        return await fetchAPI(`/api/cliente/reservaciones/${hash}`, {
            method: "DELETE"
        });
    }

    static async unirseReservacion(hash) {
        return await fetchAPI(`/api/cliente/reservaciones/${hash}/unirse`, {
            method: "POST"
        });
    }
}

export default ReservacionesRepository;