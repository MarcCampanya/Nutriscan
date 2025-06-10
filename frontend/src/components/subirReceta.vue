<template>
    <div class="upload-form-container">
        <h2>Subir nueva receta</h2>
        <form @submit.prevent="subirReceta">
            <input v-model="nuevaReceta.name" type="text" class="nombre-receta" placeholder="Nombre de la receta"
                required />

            <textarea v-model="nuevaReceta.description" placeholder="Descripción" required></textarea>

            <label>Ingredientes (separados por coma):</label>
            <input v-model="nuevaReceta.ingredientesTexto" placeholder="Ej: tomate, lechuga, sal" />

            <label>Elaboración:</label>
            <textarea v-model="nuevaReceta.preparation" placeholder="Describe cómo se prepara la receta"
                required></textarea>

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
        const nuevaReceta = ref<{
            name: string;
            description: string;
            image: string;
            ingredientesTexto: string;
            ingredientes: string[];
            preparation: string;
        }>({
            name: '',
            description: '',
            image: '',
            ingredientesTexto: '',
            ingredientes: [],
            preparation: ''
        });

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
                // Asegúrate de que los ingredientes están siendo convertidos correctamente
                console.log('Ingredientes antes de enviar:', nuevaReceta.value.ingredientesTexto);

                // Convertir ingredientes de texto a un arreglo de strings
                nuevaReceta.value.ingredientes = nuevaReceta.value.ingredientesTexto
                    .split(',')
                    .map(i => i.trim())
                    .filter(i => i !== '');

                // Verificar que los ingredientes ahora estén en formato de arreglo
                console.log('Ingredientes después de convertir:', nuevaReceta.value.ingredientes);

                // Enviar la receta
                await axios.post('http://localhost:3000/api/subirReceta', nuevaReceta.value);
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
    padding: 25px;
    background: #f8f8f8;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.upload-form-container h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #3b564d;
}

.upload-form-container form {
    display: flex;
    flex-direction: column;
}

.upload-form-container input,
.upload-form-container textarea {
    margin-bottom: 15px;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: vertical;
    font-family: inherit;
}

.upload-form-container label {
    font-weight: 600;
    margin-bottom: 5px;
    color: #333;
}

.upload-form-container button {
    padding: 12px;
    background-color: #3b564d;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.upload-form-container button:hover {
    background-color: #2d403a;
}
</style>