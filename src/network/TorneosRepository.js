import fetchAPI from './apiConstants';

class TorneosRepository {
    static async getTorneos() {
        return await fetchAPI('/api/cliente/torneos');
    }

    static async getTorneo(id) {
        return await fetchAPI(`/api/cliente/torneos/${id}`);
    }

    static async unirseTorneo(id, data) {
        return await fetchAPI(`/api/cliente/torneos/${id}/unirse`, {
            method: "POST",
            body: JSON.stringify(data)
        });
    }

    static async getDetalleEquipoTorneo(hash) {
        return await fetchAPI(`/api/cliente/torneos/equipo/${hash}`);
    }

    static async unirseEquipoTorneo(hash) {
        return await fetchAPI(`/api/cliente/torneos/equipo/${hash}/unirse`,
            { method: "POST" }
        );
    }

    static async abandonarEquipoTorneo(hash) {
        return await fetchAPI(`/api/cliente/torneos/equipo/${hash}/abandonar`,
            { method: "POST" }
        );
    }
}
export default TorneosRepository;