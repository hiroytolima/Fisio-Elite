import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { MainLayout } from '@/shared/ui/layout/MainLayout';
import { ErrorBoundary } from '@/app/errors/ErrorBoundary';
import { HomePage } from '@/pages/HomePage';
import { SofaPage } from '@/pages/SofaPage';
import { RoxPage } from '@/pages/RoxPage';
import { GlasgowPage } from '@/pages/GlasgowPage';
import { CifPage } from '@/pages/CifPage';
import { Ciap2Page } from '@/pages/Ciap2Page';
import { HacorPage } from '@/pages/HacorPage';
import { GasometriaPage } from '@/pages/GasometriaPage';
import { FisioIaPage } from '@/pages/FisioIaPage';
import { PatientsPage } from '@/pages/PatientsPage';
import { CamIcuPage } from '@/pages/CamIcuPage';

export const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="camicu" element={<CamIcuPage />} />
            <Route path="sofa" element={<SofaPage />} />
            <Route path="rox" element={<RoxPage />} />
            <Route path="glasgow" element={<GlasgowPage />} />
            <Route path="hacor" element={<HacorPage />} />
            <Route path="gasometria" element={<GasometriaPage />} />
            <Route path="cif" element={<CifPage />} />
            <Route path="ciap2" element={<Ciap2Page />} />
            <Route path="fisioia" element={<FisioIaPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
