/*
 * @Author       : ADI
 * @Date         : 2021-04-19 13:40:19
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-19 15:17:42
 */
// register globally
const req = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);
