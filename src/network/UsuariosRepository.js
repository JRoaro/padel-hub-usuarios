import fetchAPI from './apiConstants';

class UsuariosRepository {
    static async logout() {
        return await fetchAPI('/logout', {
            method: "POST"
        });
    }

    static async getPerfil() {
        return await fetchAPI('/api/cliente/perfil');
    }

    static async updatePerfil(user) {
        const formData = new FormData();
        formData.append("name", user.name || "");
        formData.append("last_name", user.last_name || "");
        formData.append("email", user.email || "");
        formData.append("password", user.password);
        formData.append("fecha_nacimiento", user.fecha_nacimiento || "");
        formData.append("telefono", user.telefono || "");
        formData.append("mano_dominante", user.mano_dominante || "");
        formData.append("posicion", user.posicion || "");
        formData.append("golpe_favorito", user.golpe_favorito || "");
        formData.append("frecuencia_padel", user.frecuencia_padel || "");
        formData.append("estilo_juego", user.estilo_juego || "");
        formData.append("categoria", user.categoria || "");
        formData.append("logro_id", user.logro_id || "");
        
        if (user.foto) {
            formData.append("foto", user.foto);
        }

        return await fetchAPI('/api/cliente/perfil', {
            method: "POST",
            body: formData
        }, true);
    }

    static async registroCliente(user) {
        const formData = new FormData();
        formData.append("name", user.name || "");
        formData.append("last_name", user.last_name || "");
        formData.append("email", user.email || "");
        formData.append("password", user.password);
        formData.append("fecha_nacimiento", user.fecha_nacimiento || "");
        formData.append("telefono", user.telefono || "");
        formData.append("mano_dominante", user.mano_dominante || "");
        formData.append("posicion", user.posicion || "");
        formData.append("golpe_favorito", user.golpe_favorito || "");
        formData.append("frecuencia_padel", user.frecuencia_padel || "");
        formData.append("estilo_juego", user.estilo_juego || "");
        formData.append("categoria", user.categoria || "");
        
        if (user.foto) {
            formData.append("foto", user.foto);
        }

        return await fetchAPI(`/api/register-cliente`, {
            method: "POST",
            body: formData
        }, true);
    }

}

export default UsuariosRepository;
