# parcial1_2_50_S_D

Justificación del número de réplicas de workers.

Considero que para este sistema se pueden usar dos réplicas de workers debido a que esto nos puede ayudar a un mejor balanceo de carga.
Otra razón puede ser por la escalabilidad horizontal ya que en dado caso que aumenten las imagenes recibidas pues bastaría con aplicar
más réplicas del worker sin tener que modificar un worker directamente.
Además otra razón para usar dos r´eplicas de worker es la tolerancia a fallos debido a que si un contenedor falla otro lo remplazara para 
seguir procesando las tareas.

Tipo de exchange, bindings y su impacto en escalabilidad.

En este caso se planea usar el exchange direct para las colas para la realización de tareas esepcíficas como lo son: redimensionado,
marca de agua y detección, para así, poder escalar cada una independientemente.
Por otro lado tambíen se planea usar el exchange fanout para notificar cuando una imagen a terminado su procesamiento, permitiendo que múltiples servicios escuchen el mismo mensaje sin que el productor los tenga que conocer.
Lo anterior ayuda en la escalabilidad porque se puede añadir nuevos workers sin modificar la lógica del productor.

Estrategia de manejo de errores y reintentos


Opciones de persistencia (disco o. memoria) y su relación con la
consistencia
La persistencia que se va a utilizar en tese sistema del parcial es en disco debido a que esto nos ayuda a guardar el estado de las imagenes en dado caso que un contenedor se reincie, además de que cumple con lo mencionado anteriormente que es la tolerancia a fallos debido a que si un worker se cae otro lo reemplaza para seguir con su tarea 

Comando para ejecutar 
docker compose up --build

