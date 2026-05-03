'use client';
import { Card, Title, BarChart, AreaChart, ScatterChart, DonutChart } from '@tremor/react';

interface ChartData {
  egresadosPorAño: any[];
  tendenciaContratacion: any[];
  habilidadesDemandadas: any[];
}

export function AdminCharts({ data }: { data: ChartData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card>
        <Title>Distribución de Egresados por Año</Title>
        <BarChart
          className="mt-6"
          data={data.egresadosPorAño}
          index="año"
          categories={['cantidad']}
          colors={['blue']}
          yAxisWidth={48}
        />
      </Card>

      <Card>
        <Title>Tendencia de Contratación Mensual</Title>
        <AreaChart
          className="mt-6"
          data={data.tendenciaContratacion}
          index="mes"
          categories={['ofertas', 'contrataciones']}
          colors={['indigo', 'emerald']}
          yAxisWidth={48}
        />
      </Card>

      <Card>
        <Title>Habilidades más Demandadas</Title>
        <DonutChart
          className="mt-6"
          data={data.habilidadesDemandadas}
          category="cantidad"
          index="nombre"
          colors={['rose', 'yellow', 'orange', 'indigo', 'blue', 'emerald']}
        />
      </Card>

      <Card>
        <Title>Años de Experiencia vs Postulaciones</Title>
        <ScatterChart
          className="mt-6 h-80"
          data={[
            { x: 1, y: 5, label: 'Egresado A' },
            { x: 2, y: 12, label: 'Egresado B' },
            { x: 5, y: 25, label: 'Egresado C' },
            { x: 3, y: 18, label: 'Egresado D' },
          ]}
          x="x"
          y="y"
          category="label"
          colors={['blue']}
          showLegend={false}
        />
      </Card>
    </div>
  );
}
