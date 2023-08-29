import React from "react";
import { useEffect, useState } from "react";
import financialGoalsService from "services/financialGoalsService";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import GoalsCard from "./GoalsCard";
import { Col, Row, Card, Table, Container } from "react-bootstrap";
import GoalsFormModal from "./GoalsFormModal";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import { useNavigate } from "react-router-dom";
import "../financialgoals/financialgoalspage.css";
import toastr from "toastr";
import { formatDateTime } from "utils/dateFormater";
import Icon from "@mdi/react";
import { mdiPlusBox, mdiArrowLeftBoldBox, mdiCheckCircle, mdiMagnify, mdiRestore } from "@mdi/js";

function GoalsPage(props) {
  const _logger = debug.extend("GoalsPage");
  const navigate = useNavigate();

  const [goalPageData, setGoalPageData] = useState({
    arrayOfGoals: [],
    goalComponents: [],
    pageSize: 5,
    currentPage: 1,
    createdById: props.currentUser.id,
    totalCards: 0,
    query: "",
    reset: false,
    isCompleted: false,
  });

  const [modal, setModal] = useState({ show: false, handleChange: false });
  const [showCompleted, setShowCompleted] = useState({ show: false });

  useEffect(() => {
    if (goalPageData.query) {
      financialGoalsService
        .search(
          goalPageData.currentPage - 1,
          goalPageData.pageSize,
          goalPageData.query,
          goalPageData.isCompleted
        )
        .then(onSearchSuccess)
        .catch(onSearchError);
    }
    if (!goalPageData.query) {
      financialGoalsService
        .getByCreatedBy(
          goalPageData.currentPage - 1,
          goalPageData.pageSize,
          goalPageData.isCompleted
        )
        .then(onGetByCreatedBySuccess)
        .catch(onGetByCreatedByError);
    }
  }, [goalPageData.currentPage, showCompleted.show, goalPageData.reset, goalPageData.totalCards]);

  const openModal = () => {
    setModal((prevState) => {
      const handleModal = { ...prevState };
      handleModal.show = true;
      return handleModal;
    });
  };
  const closeModal = () => {
    setModal((prevState) => {
      const handleModal = { ...prevState };
      handleModal.show = false;
      return handleModal;
    });
    navigate(`/goals`);
  };

  const mapGoals = (aGoal) => {
    return (
      <GoalsCard
        goal={aGoal}
        key={aGoal.id}
        showModal={openModal}
        hide={closeModal}
        onDeleteSuccess={onDeleteSuccess}
        mapper={mapGoals}
        onCompletedSuccess={onCompletedSuccess}
        showCompleted={showCompleted}
      />
    );
  };
  const onGetByCreatedBySuccess = (response) => {
    _logger("GET BY CREATED BY SUCCESS", response);

    let goalArr = response.item.pagedItems;

    setGoalPageData((prevState) => {
      const pd = { ...prevState };
      pd.arrayOfGoals = goalArr;
      pd.arrayOfGoals = pd.arrayOfGoals.map((goal) => {
        goal.targetDate = formatDateTime(goal.targetDate);
        return goal;
      });
      pd.totalCards = response.item.totalCount;

      pd.goalComponents = pd.arrayOfGoals.map(mapGoals);

      return pd;
    });
  };

  const onGetByCreatedByError = (error) => {
    toastr.error(error.message, "Error");
    _logger("GET BY CREATED BY ERROR", error);
  };

  const onPageChange = (page) => {
    setGoalPageData((prevState) => {
      const pd = { ...prevState };
      pd.currentPage = page;
      return pd;
    });
  };

  const onUpdateSuccess = (itemUpdated) => {
    _logger("item updated", itemUpdated);
    setGoalPageData((prevState) => {
      const pd = { ...prevState };
      const index = pd.arrayOfGoals.findIndex((goal) => goal.id === itemUpdated.id);
      if (index >= 0) {
        pd.arrayOfGoals[index] = itemUpdated;
      }
      pd.goalComponents = pd.arrayOfGoals.map(mapGoals);
      return pd;
    });
  };

  const onAddSuccess = (itemAdded) => {
    _logger("item Added", itemAdded);
    setGoalPageData((prevState) => {
      const pd = { ...prevState };
      pd.arrayOfGoals = [itemAdded, ...pd.arrayOfGoals];
      if (pd.arrayOfGoals.length > pd.pageSize) {
        pd.totalCards++;
        pd.totalPages++;
      }
      pd.currentPage = 1;
      pd.goalComponents = pd.arrayOfGoals.map(mapGoals);
      return pd;
    });
  };
  const onDeleteSuccess = (itemDeleted) => {
    setGoalPageData((prevState) => {
      const pd = { ...prevState };
      let index = pd.arrayOfGoals.findIndex((goal) => goal.id === itemDeleted);
      if (index >= 0) {
        pd.arrayOfGoals.splice(index, 1);
        pd.goalComponents = pd.arrayOfGoals.map(mapGoals);
      }
      if (pd.arrayOfGoals.length === 0) {
        pd.currentPage--;
      }
      pd.totalCards--;
      _logger("check after delete", pd);
      return pd;
    });
  };

  const onCompletedSuccess = (itemCompleted) => {
    _logger("ITEM ", itemCompleted);
    setGoalPageData((prevState) => {
      const pd = { ...prevState };
      let index = pd.arrayOfGoals.findIndex((goal) => goal.id === itemCompleted.id);
      if (index >= 0) {
        pd.arrayOfGoals.splice(index, 1);
        pd.goalComponents = pd.arrayOfGoals.map(mapGoals);
      }
      if (pd.arrayOfGoals.length === 0) {
        pd.currentPage--;
      }
      pd.totalCards--;

      return pd;
    });
  };

  const handleShow = () => {
    setShowCompleted((prevState) => {
      const toggleshow = { ...prevState };
      toggleshow.show = !prevState.show;
      return toggleshow;
    });

    setGoalPageData((prevState) => {
      const newPage = { ...prevState };
      newPage.currentPage = 1;
      newPage.query = "";
      newPage.isCompleted = !prevState.isCompleted;
      return newPage;
    });
  };

  const onFormFieldChange = (e) => {
    setGoalPageData((prevstate) => {
      const newQuery = { ...prevstate };
      newQuery.query = e.target.value;
      return newQuery;
    });
  };

  const onSearch = (query) => {
    setGoalPageData((prevState) => {
      const pageChange = { ...prevState };
      pageChange.currentPage = 1;
      pageChange.reset = false;
      return pageChange;
    });

    if (goalPageData.currentPage === 1) {
      financialGoalsService
        .search(
          goalPageData.currentPage - 1,
          goalPageData.pageSize,
          query,
          goalPageData.isCompleted
        )
        .then(onSearchSuccess)
        .catch(onSearchError);
    }
  };

  const onSearchSuccess = (response) => {
    _logger("Search Success", response);
    let goalArr = response.item.pagedItems;

    setGoalPageData((prevState) => {
      const pd = { ...prevState };
      _logger("GOALARR", goalArr);
      pd.arrayOfGoals = goalArr;
      pd.arrayOfGoals = pd.arrayOfGoals.map((goal) => {
        goal.targetDate = formatDateTime(goal.targetDate);
        return goal;
      });
      pd.totalCards = response.item.totalCount;

      pd.goalComponents = pd.arrayOfGoals.map(mapGoals);

      _logger("PD", pd);
      return pd;
    });
  };

  const onSearchError = (error) => {
    toastr.error("Goal Not Found");
    _logger("Search Error", error);
  };
  const searchClicked = () => {
    onSearch(goalPageData.query);
  };

  const handleReset = () => {
    setGoalPageData((prevState) => {
      let pd = { ...prevState };
      pd.query = "";
      pd.currentPage = 1;
      pd.reset = true;
      return pd;
    });
  };

  return (
    <>
      {modal.show && (
        <GoalsFormModal
          isOpen={modal.show}
          show={openModal}
          hide={closeModal}
          onUpdateSuccess={onUpdateSuccess}
          onAddSuccess={onAddSuccess}
          currentUserId={props.currentUser.id}
          mapper={mapGoals}
        />
      )}
      <Row>
        <Col>
          <div className="pb-1 d-md-flex align-items-center flex-container-goal goal-title-bd">
            <div>
              <h1>Financial Goals</h1>
            </div>
          </div>
        </Col>
      </Row>

      <Container>
        <Row>
          <div className="flex-container-goal">
            <div className="d-lg-flex align-items-center flex-container-goal pb-3 pt-3">
              <div className="col">
                <input
                  type="text"
                  className=" form-control goal-search-bar"
                  placeholder="Search Goals"
                  name="query"
                  id="query"
                  value={goalPageData.query}
                  onChange={onFormFieldChange}
                />
              </div>
              <div>
                <Icon
                  path={mdiMagnify}
                  size={1.3}
                  className=" mb-2 icon-goal"
                  title="Search"
                  onClick={searchClicked}
                />
              </div>

              <Icon
                path={mdiRestore}
                size={1.3}
                onClick={handleReset}
                className=" mb-2 icon-goal"
                title="Clear Search"
              />
              {showCompleted.show ? (
                <div>
                  <Icon
                    path={mdiPlusBox}
                    size={1.3}
                    className="me-2 mb-2 icon-goal d-none"
                    title="New Goal"
                    onClick={openModal}
                  />
                </div>
              ) : (
                <div>
                  <Icon
                    path={mdiPlusBox}
                    size={1.3}
                    className=" mb-2 icon-goal"
                    title="New Goal"
                    onClick={openModal}
                  />
                </div>
              )}

              {showCompleted.show ? (
                <div>
                  <Icon
                    path={mdiArrowLeftBoldBox}
                    size={1.3}
                    className=" mb-2 icon-goal"
                    title="Back"
                    onClick={handleShow}
                  />
                </div>
              ) : (
                <div>
                  <Icon
                    path={mdiCheckCircle}
                    size={1.3}
                    className="me-2 mb-2 icon-goal"
                    title="View Completed Goals"
                    onClick={handleShow}
                  />
                </div>
              )}
            </div>
          </div>
        </Row>
      </Container>
      <Row>
        <Card className="table-responsive">
          <Card.Body>
            <Table className="goal-table ">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Target Date</th>
                  <th>{}</th>
                </tr>
              </thead>
              {goalPageData.goalComponents}
            </Table>
          </Card.Body>
        </Card>
      </Row>

      <div>
        <div className="pagination-container">
          <Pagination
            className="mt-3  pagination-container-goals  flex-grow-1 d-flex "
            onChange={onPageChange}
            current={goalPageData.currentPage}
            total={goalPageData.totalCards}
            locale={locale}
            pageSize={goalPageData.pageSize}
          />
        </div>
      </div>
    </>
  );
}
GoalsPage.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default React.memo(GoalsPage);
