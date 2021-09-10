import './EnhanceResolvers'
import {NonEmptyArray} from 'type-graphql'
import globalResolvers from './Global'
import dashboardResolvers from './Dashboard'
import appResolvers from './App'
export default [...globalResolvers,...appResolvers,...dashboardResolvers] as NonEmptyArray<Function>