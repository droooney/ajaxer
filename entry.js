import Promise from 'el-promise';
import Ajaxer from './lib/Ajaxer';

Ajaxer.usePromise(Promise);

window.Ajaxer = Ajaxer;
