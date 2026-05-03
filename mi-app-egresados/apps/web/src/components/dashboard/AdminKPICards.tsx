// apps/web/src/components/dashboard/AdminKPICards.tsx
'use client';
import { Card, Metric, Text, Grid, Flex, BadgeDelta } from '@tremor/react';

interface KPIData {
  total_egresados: number;
  total_empresas: number;
  ofertas_activas: number;
  tasa_empleabilidad: number;
}

export function AdminKPICards({ data }: { data: KPIData }) {
  return (
    <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
      <Card decoration="top" decorationColor="indigo">
        <Text>Total Egresados</Text>
        <Metric>{data.total_egresados.toLocaleString()}</Metric>
        <BadgeDelta deltaType="moderateIncrease" text="+12%" size="xs" />
      </Card>
      <Card decoration="top" decorationColor="emerald">
        <Text>Empresas Activas</Text>
        <Metric>{data.total_empresas}</Metric>
      </Card>
      <Card decoration="top" decorationColor="amber">
        <Text>Ofertas Activas</Text>
        <Metric>{data.ofertas_activas}</Metric>
      </Card>
      <Card decoration="top" decorationColor="rose">
        <Text>Tasa de Empleabilidad</Text>
        <Metric>{(data.tasa_empleabilidad * 100).toFixed(1)}%</Metric>
      </Card>
    </Grid>
  );
}