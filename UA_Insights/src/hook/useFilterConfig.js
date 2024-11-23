import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useFilterConfig = () => {
  const location = useLocation();

  const filterConfig = useMemo(() => ({
    '/cadeira': [
      {
        type: 'select',
        label: 'Disciplina',
        field: 'idisciplinaid',
        isDynamic: true,
      },
      {
        type: 'select',
        label: 'Época',
        options: ['Todas', 'Normal', 'Recurso'],
      }
    ],
    '/universidade': [
      {
        type: 'select',
        label: 'Regime',
        field: 'nome_regime',
        isDynamic: true,
      }
    ],
    '/departamento': [
      {
        type: 'select',
        label: 'Departamento',
        field: 'dep_sigla_oficial',
        isDynamic: true,
      }
    ],
    '/curso': [
      {
        type: 'select',
        label: 'Curso',
        field: 'icursocod',
        isDynamic: true,
      }
    ]
  }), []);

  return filterConfig[location.pathname] || [];
};