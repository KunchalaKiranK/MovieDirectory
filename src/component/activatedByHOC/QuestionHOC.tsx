import {useEffect, useState} from 'react';
import {TYPE} from 'safeguard-corescript-npm';

import {useAppSelector} from '../../_app';
import {activatedByCheck} from '../../utils';
import {getComponent} from '../../config';

const QuestionHOC = (props: TYPE.QuestionProps) => {
  const {ActivatedBy} = props;

  // get data from store
  const currentOrder = useAppSelector(state => state.user.orderNumber);
  const Question = useAppSelector(state => state.script.survey.questions);

  const [activate, setActivate] = useState<boolean>(false);

  useEffect(() => {
    if (ActivatedBy) {
      let val = activatedByCheck(ActivatedBy, currentOrder, 'survay');
      if (activate !== val) setActivate(val);
    }
  }, [Question]);

  return ActivatedBy && activate ? getComponent(props) : null;
};

export default QuestionHOC;
