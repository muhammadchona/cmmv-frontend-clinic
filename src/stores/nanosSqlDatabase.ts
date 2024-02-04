import Address from 'src/stores/models/address/Address';
import Country from './models/country/Country';
import Province from './models/province/Province';
import District from './models/district/District';
import Utente from 'src/stores/models/utente/Utente';
import InfoDocsOrImages from './models/dorcOrImages/InfoDocsOrImages';
import Clinic from './models/clinic/Clinic';
import Appointment from './models/appointment/Appointment';
import VMMCArticle from './models/article/VMMCArticle';
import Messages from './models/messages/Message';
import CommunityMobilizer from './models/mobilizer/CommunityMobilizer';
import { UserLogin } from './models/userLogin/UserLogin';

export default {
  getEntities() {
    const entitiesList = [];
    entitiesList.push(Country);
    entitiesList.push(Province);
    entitiesList.push(District);
    entitiesList.push(Appointment);
    entitiesList.push(Utente);
    entitiesList.push(VMMCArticle);
    entitiesList.push(Messages);
    entitiesList.push(CommunityMobilizer);
    entitiesList.push(UserLogin);
    entitiesList.push(InfoDocsOrImages);
    entitiesList.push(Clinic);
    entitiesList.push(Address);
   
    return entitiesList;
  },
};
