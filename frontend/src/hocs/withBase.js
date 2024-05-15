import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

const withBase = (Componet) => (prop) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return <Componet {...prop} dispatch={dispatch} navigate={navigate}/>;
};
export default withBase;
