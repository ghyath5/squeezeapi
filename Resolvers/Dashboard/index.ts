import {   NonEmptyArray } from 'type-graphql'
import { Auth } from './Auth';
import Users from './Users';

export default [Auth,...Users] as NonEmptyArray<Function>