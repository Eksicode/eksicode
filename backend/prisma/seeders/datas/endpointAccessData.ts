import { EndpointAccess } from '@prisma/client';

export const endpointAccessData = [
  {
    path: '/users',
    method: 'get',
    requiredRoles: ['admin', 'superadmin'],
    requiredPermissions: ['VIEW_USERS']
  },
  {
    path: '/users/:id',
    method: 'get',
    requiredRoles: ['user', 'admin', 'superadmin'],
    requiredPermissions: ['VIEW_USER']
  },
  {
    path: '/users',
    method: 'post',
    requiredRoles: ['admin', 'superadmin'],
    requiredPermissions: ['CREATE_USER']
  },
  {
    path: '/users/:id',
    method: 'put',
    requiredRoles: ['user', 'admin', 'superadmin'],
    requiredPermissions: ['UPDATE_USER']
  },
  {
    path: '/users/:id',
    method: 'delete',
    requiredRoles: ['admin', 'superadmin'],
    requiredPermissions: ['DELETE_USER']
  }
];