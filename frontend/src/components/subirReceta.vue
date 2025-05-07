<template>
    <div class="upload-form-container">
        <h2>Subir nueva receta</h2>
        <form @submit.prevent="subirReceta">
            <input v-model="nuevaReceta.name" type="text" placeholder="Nombre de la receta" required />
            <textarea v-model="nuevaReceta.description" placeholder="Descripción" required></textarea>
            <input type="file" @change="convertirImagenABase64" required />
            <button type="submit">Subir Receta</button>
        </form>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    name: 'SubirReceta',
    setup() {
        const nuevaReceta = ref({ name: '', description: '', image: '' });
        const router = useRouter();

        const convertirImagenABase64 = (event: Event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    nuevaReceta.value.image = reader.result as string;
                };
                reader.readAsDataURL(file);
            }
        };

        const subirReceta = async () => {
            try {
                await axios.post('http://localhost:3000/api/receta', nuevaReceta.value);
                router.push('/recetas');
            } catch (error) {
                console.error('Error al subir receta:', error);
            }
        };

        return {
            nuevaReceta,
            subirReceta,
            convertirImagenABase64
        };
    }
};
</script>

<style scoped>
.upload-form-container {
    max-width: 600px;
    margin: 30px auto;
    padding: 20px;
    background: #f8f8f8;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.upload-form-container form {
    display: flex;
    flex-direction: column;
}

.upload-form-container input,
.upload-form-container textarea {
    margin-bottom: 15px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.upload-form-container button {
    padding: 10px;
    background-color: #3b564d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.upload-form-container button:hover {
    background-color: #2d403a;
}
</style>
