"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  mes: string;
  ofertas: number;
  postulaciones: number;
}

export function AnalyticsChart({ data }: { data: ChartData[] }) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Evolución de Ofertas vs Postulaciones</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ofertas" stroke="#8884d8" name="Ofertas" />
              <Line type="monotone" dataKey="postulaciones" stroke="#82ca9d" name="Postulaciones" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
