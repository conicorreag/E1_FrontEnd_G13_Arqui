### Documentación E3 grupo 13

### Flujos configueración IaaC

A continuación se explica el flujo de la configuración de terraform.

**Configuración Bucket S3**

1. En primer lugar, define la versión requerida de Terraform y el proveedor de la nube (AWS en este caso) con la versión específica.
2. Luego se configura el proveedor de AWS y establece la región como us-east-2.
3. A continuación, se define un recurso de tipo aws_s3_bucket llamado public_bucket con el nombre del bucket como iaac-bucket. Puedes cambiar el nombre del bucket según tus preferencias.
5. Se configura un bloque de acceso público para el bucket S3, permitiendo el acceso público a los objetos en el bucket al desactivar las restricciones.
6. Se configura una política para el bucket S3 que permite el acceso público de lectura ("s3:GetObject") a los objetos en el bucket.
7. Finalmente, se define una salida que muestra el nombre del bucket creado.

**Configuración Cloudfront**

1. En primer lugar, se especifica la configuración de Terraform. Indica que el proveedor de infraestructura que se va a utilizar es AWS, y se espera que sea de la versión 4.16 o superior.
2. Luego, se configura el proveedor AWS con la región us-east-2.
3. A continuación, se define un recurso para un certificado SSL en AWS Certificate Manager (ACM) para el dominio belukoatica.me. Utiliza el método de validación DNS para validar la propiedad del dominio.
4. Se crea un recurso para una distribución de CloudFront, se especifica la configuración del origen, en este caso, un bucket de S3 en AWS, se establece restricciones geográficas para permitir solo tráfico desde Estados Unidos (US) y Canadá (CA) y se habilita la distribución y establece index.html como el objeto raíz predeterminado.
5. Finalmente, se configura el comportamiento predeterminado de la distribución., se especifica qué métodos HTTP están permitidos y cuáles se deben almacenar en caché, se define cómo se deben manejar las cookies y las consultas en la URL, se establece la política de protocolo del espectador como redirect-to-https para redirigir automáticamente el tráfico HTTP a HTTPS y se configura los tiempos de vida de la caché (TTL) mínimo, predeterminado y máximo.

