import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import debug from "sabio-debug";
import financialGoalsService from "services/financialGoalsService";
import Swal from "sweetalert2";
import Icon from "@mdi/react";
import { mdiTrashCan, mdiFileEdit } from "@mdi/js";
import toastr from "toastr";

function GoalsCard(props) {
  const _logger = debug.extend("GoalsCard");
  const aGoal = props.goal;
  const navigate = useNavigate();
  const onEditClicked = (e) => {
    e.preventDefault();
    const stateForTransport = { type: "GOAL_VIEW", payload: aGoal };
    _logger("State for transport", stateForTransport);
    navigate(`/goals/${aGoal.id}/edit`, { state: stateForTransport });
    props.showModal();
  };

  const onCompletedClicked = (e) => {
    if (e.target.checked === true) {
      Swal.fire({
        title: "Confirm",
        text: "Has This Goal Been Completed?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Complete",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          toastr.success("Goal has been successfully completed.");
          const onCompleteSuccess = onCompletedSuccessHandler(aGoal);
          financialGoalsService
            .updateIsCompleted(aGoal.id, aGoal.isCompleted)
            .then(onCompleteSuccess)
            .catch(onError);
        } else if (result.isDismissed) {
          e.target.checked = false;
        }
      });
    } else {
      Swal.fire({
        title: "Please Confirm",
        text: "Do you want to Continue Working on This Goal?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Continue Working",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          const onCompleteSuccess = onCompletedSuccessHandler(aGoal);
          financialGoalsService
            .updateIsCompleted(aGoal.id, aGoal.isCompleted)
            .then(onCompleteSuccess)
            .catch(onError);
        } else if (result.isDismissed) {
          e.target.checked = true;
        }
      });
    }
  };

  const onCompletedSuccessHandler = (itemCompleted) => {
    return (response) => {
      props.onCompletedSuccess(itemCompleted);
      const completeResponse = { ...response, itemCompleted };
      _logger("delete", completeResponse);
    };
  };

  const onDeleteClicked = () => {
    Swal.fire({
      title: "Confirm Delete",
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        toastr.success("Goal has been successfully deleted.");
        const onDeleteSuccess = onDeleteSuccessHandler(aGoal.id);
        financialGoalsService.deleteById(aGoal.id).then(onDeleteSuccess).catch(onError);
      }
    });
  };

  const onDeleteSuccessHandler = (id) => {
    return (response) => {
      props.onDeleteSuccess(id);
      const deleteResponse = { ...response, id };
      _logger("delete", deleteResponse);
    };
  };

  const onError = (error) => {
    Swal.fire({
      title: "Error!",
      text: error.response.data.errors,
      icon: "error",
      confirmButtonText: "Close",
    });
    _logger("error from icon", error);
  };
  return (
    <>
      <tbody>
        <tr>
          <td className="pt-5 goal-table-element">{aGoal.goalType.name}</td>
          <td className="pt-5 goal-table-element">{aGoal.name}</td>
          <td className="pt-5 goal-table-element">{aGoal.description}</td>
          <td className="pt-5 goal-table-element">{aGoal.targetDate}</td>
          <td className="pt-5 goal-table-element">
            {props.showCompleted.show ? (
              <input
                className="form-check-input me-5 icon-goal responsive-icon"
                type="checkbox"
                value=""
                id="checkbox"
                name="GoalReached"
                title="Complete Goal"
                onClick={onCompletedClicked}
                defaultChecked
              />
            ) : (
              <input
                className="form-check-input me-5 icon-goal responsive-icon"
                type="checkbox"
                value=""
                id="checkbox"
                name="GoalReached"
                title="Complete Goal"
                onClick={onCompletedClicked}
              />
            )}

            {props.showCompleted.show ? (
              <Icon
                path={mdiFileEdit}
                size={0.9}
                className="me-5 icon-goal d-none"
                title="Edit Goal"
                onClick={onEditClicked}
              />
            ) : (
              <Icon
                path={mdiFileEdit}
                size={0.9}
                className="me-5 icon-goal responsive-icon"
                title="Edit Goal"
                onClick={onEditClicked}
              />
            )}

            <Icon
              path={mdiTrashCan}
              id="Delete"
              size={0.9}
              className="me-5 icon-goal responsive-icon"
              title="Delete Goal"
              onClick={onDeleteClicked}
              name="Delete"
            />
          </td>
        </tr>
      </tbody>
    </>
  );
}

GoalsCard.propTypes = {
  goal: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    targetDate: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    goalType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  showModal: PropTypes.func.isRequired,
  mapper: PropTypes.func.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
  onCompletedSuccess: PropTypes.func.isRequired,
  showCompleted: PropTypes.shape({
    show: PropTypes.bool.isRequired,
  }).isRequired,
};

export default React.memo(GoalsCard);
