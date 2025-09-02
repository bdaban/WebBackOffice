// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
 compatibilityDate: '2025-07-15',
 devtools: { enabled: false },
 css: ['~/assets/css/main.css'],
modules: ['nuxt-echarts'],

 vite: {
   esbuild: {
   tsconfigRaw: {
     compilerOptions: {
       experimentalDecorators: true,
       emitDecoratorMetadata: true
     }
   }
 },
 plugins: [
   tailwindcss(),
 ],
},

 nitro: { preset: 'node',
    esbuild: {
       options: {
         tsconfigRaw: {
           compilerOptions: {
             experimentalDecorators: true,
             emitDecoratorMetadata: true
           }
         }
       }
     }
  },

 runtimeConfig: {
   db: {
     type: process.env.DB_TYPE,
     host: process.env.DB_HOST,
     port: process.env.DB_PORT,
     username: process.env.DB_USERNAME,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_DATABASE,
   }
 },


})