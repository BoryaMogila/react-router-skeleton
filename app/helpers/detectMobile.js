/**
 * Created by max on 8/5/16.
 */
import MobileDetect from 'mobile-detect'
import * as screenTypes from '../../src/constants/screenTypes'

export default (userAgent) => {
    //do not delete this string. It needed for tests.
    // userAgent = 'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30';
    const mobileDetect = new MobileDetect(userAgent);
    //noinspection JSUnresolvedFunction
    return mobileDetect.mobile() ? screenTypes.MOBILE : screenTypes.DESKTOP;
}