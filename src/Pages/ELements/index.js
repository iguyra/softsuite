import Search from "../../Components/Search";
import { TableList } from "../../Components/Layouts/TableList";

import { useMemo } from "react";

import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import * as Yup from "yup";
import { debounce } from "lodash";
import makeApiCall from "../../utils/makeApiCall";
import { useFormik } from "formik";

import {
  Col,
  Row,
  Label,
  Input,
  Modal,
  ModalBody,
  Form,
  FormFeedback,
} from "reactstrap";

function Elements() {
  const [elements, setElements] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Column
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "title",
        filterable: false,
      },
      {
        Header: "Element Category",
        Cell: (cellProps) => {
          let description = cellProps.row.original.description;

          if (!description) return;

          if (description.length > 60) {
            description = description.slice(0, 60);
            description = description + "...";
          }

          return (
            <React.Fragment>
              <div>{description}</div>{" "}
            </React.Fragment>
          );
        },
      },

      {
        Header: "Element Classification",
        accessor: "target_group",
        filterable: false,
      },

      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Date & Time Modified",
        accessor: "time_modified",
      },
      {
        Header: "Modified By",
        accessor: "Modified_by",
      },
      {
        Header: "Actions",
        Cell: (cellProps) => {
          return (
            <React.Fragment>
              <div
                onClick={() => {
                  const c = cellProps.row.original;
                  //   handleEdit(c);
                }}
                className="list-inline-item"
              >
                edit
                <i className="ri-folder-fill fs-16"></i>
              </div>
              <div
                onClick={() => {
                  const clientData = cellProps.row.original;
                  //   onClickDelete(clientData);
                }}
                className="d-inline-block"
              >
                delete
              </div>
            </React.Fragment>
          );
        },
      },
    ],

    []
  );

  const [isUpdate, setIsUpdate] = useState(false);
  const [campaigns, setCampaignsList] = useState([]);
  const [campaign, setCampaign] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [totalCampaigns, setTotalCampaigns] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [IsError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const resetFlag = () => {
    setIsSubmitted(false);
    setIsError(false);
    setIsDeleted(false);
    setErrorMsg("");
    setIsAdded(false);
    setIsUpdated(false);
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (isDeleted || isAdded || isUpdated || IsError) {
      setTimeout(() => {
        resetFlag();
      }, 3000);
    }
  }, [isDeleted, isAdded, isUpdated, IsError]);

  useEffect(() => {
    const getCampaignsList = async () => {
      setIsLoading(true);

      try {
        let data = await new makeApiCall().get(`campaigns`, {
          params: {
            skip: 0,
            limit: 4,
          },
        });

        setCampaignsList(data.campaigns);
        setTotalCampaigns(data.totalCount);

        setIsLoading(false);
      } catch (err) {
        handleError();
        setIsLoading(false);
      }
    };
    getCampaignsList();
  }, [isSubmitted]);

  const toggle = useCallback(() => {
    setModal(!modal);
  }, [modal]);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      title: campaign?.title || "Mobile web coming soon	",
      description:
        campaign?.description ||
        "Lorem ipsum dolor sit consectetur. Di am phasellus ut nisl d...",
      target_group: campaign?.target_group || "",
      status: campaign?.status || "",
    },

    validationSchema: Yup.object({
      title: Yup.string()
        .required("Please enter campaign title")
        .max(100, "Maximum length is 100 characters"),

      status: Yup.string()
        .required("Please enter status here")
        .max(20, "status cannot be more than 20 characters"),

      target_group: Yup.string().required("Please enter target_group here"),

      description: Yup.string()
        .required("Please enter description here")
        .max(100, "description cannot be more than 100 characters"),
    }),

    onSubmit: async (values) => {
      resetFlag();
      setIsLoading(true);

      if (isUpdate) {
        try {
          await new makeApiCall().put("campaigns", {
            ...values,
            _id: campaign._id,
          });

          setIsSubmitted(true);
          setIsLoading(false);
          setIsUpdated(true);
          toggle();

          validation.resetForm();
          setIsLoading(false);
          return;
        } catch (err) {
          handleError(err);
          setIsLoading(false);

          return;
        }
      }

      try {
        await new makeApiCall().post("campaigns", values);

        setIsLoading(false);
        setIsSubmitted(true);
        setIsAdded(true);
        toggle();
        validation.resetForm();
        setIsLoading(false);
      } catch (err) {
        handleError(err);
        setIsLoading(false);
      }
    },
  });

  const handleEdit = (p) => {
    setIsUpdate(true);
    setCampaign(p);
    toggle();
  };

  const handleToggle = () => {
    setIsUpdate(false);
    setCampaign({});
    toggle();
  };

  const handleDelete = async (p) => {
    resetFlag();
    setIsLoading(true);

    await new makeApiCall().delete("campaigns", {
      data: {
        _id: campaign._id,
      },
    });
    setIsSubmitted(true);
    setDeleteModal(false);
    setIsLoading(false);
    setIsDeleted(true);
  };

  const onClickDelete = (p) => {
    setCampaign(p);
    setDeleteModal(true);
  };

  const search = async (term) => {
    setIsLoading(true);

    try {
      let data = await new makeApiCall().get(`campaigns/:term`, {
        params: {
          term,
        },
      });
      setCampaignsList(data.campaigns);
      setTotalCampaigns(data.totalCount);

      setIsLoading(false);
    } catch (err) {
      handleError(err);
    }
  };
  const searchHandler = useCallback(
    debounce((term) => {
      if (term) search(term);
      else search();
    }, 500),
    []
  );

  const handleSearch = (e) => {
    let term = e.target.value;

    searchHandler(term);
  };

  function handleError(err) {
    let { message } = err?.response?.data || {};

    setIsLoading(false);
    setIsSubmitted(false);
    setIsError(true);

    setErrorMsg(message || "a server error occured");
  }

  const handleOnchange = (e, type = "text") => {
    let value = e.target.value;
    let name = e.target.name;

    let regex = /[^a-zA-Z " " .]/;

    if (type === "number") {
      regex = /[^0-9]/;
    }

    if (!regex.test(value)) {
      validation.setFieldValue(name, value);
    }
  };

  const fetchData = useCallback(async ({ pageIndex, pageSize }) => {
    setIsLoading(true);

    const limit = pageSize;
    const offset = limit * pageIndex;

    try {
      let data = await new makeApiCall().get(`campaigns`, {
        params: {
          skip: offset,
          limit,
        },
      });
      setCampaignsList(data.campaigns);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  }, []);

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const targetGroupOptions = [
    { label: "All customers", value: "All customers" },
    { label: "customers", value: "customers" },
  ];

  return (
    <div className="elementspage">
      <div className="elementspage__container">
        <h4>Elements</h4>

        <div className="cardtableheader">
          <div className="cardtableheader__container">
            <Search />
            <img src="/filter.png" alt="" />
          </div>

          <div onClick={() => setShowModal(true)} className="create-card">
            create element
          </div>
        </div>

        {!elements.length > 0 ? (
          <TableList
            columns={columns}
            data={[]}
            isGlobalFilter={false}
            isAddUserList={false}
            customFetchData={() => 0}
            customTotalSize={4}
            customPageSize={4}
            theadClass="table-light"
          />
        ) : (
          <div className="emptypagecard">
            <img src="/empty.png" alt="" />

            <div className="emptypagecard__bottom">
              <img src="/emdanger.png" alt="" />
              <span>there are no elements to display</span>
            </div>
          </div>
        )}
      </div>

      <div
        className={`modal ${showModal ? "active" : ""}`}
        id="showModal"
        size="lg"
        isOpen={true}
        toggle={toggle}
        centered
      >
        <div className="modal__container">
          <div className="modal__head">
            <img src="/static/icons/createc.png" alt="" />
          </div>

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <div className="row">
              <div className="form__group">
                <Label className="label"> Name</Label>

                <input
                  className="select"
                  name="name"
                  //   onChange={(e) =>
                  //     validation.setFieldValue("industry", e.value)
                  //   }
                  placeholder="input name"
                  //   value={industryOptions.find(
                  //     (g) => g.value === validation.values.industry
                  //   )}
                  //   invalid={
                  //     validation.touched.industry && validation.errors.industry
                  //       ? true
                  //       : false
                  //   }
                />
              </div>
              <div className="form__group">
                <Label className="label">Element Classification</Label>

                <Select
                  className="select"
                  name="classification"
                  //   onChange={(e) =>
                  //     validation.setFieldValue("industry", e.value)
                  //   }
                  options={[{ label: "one", value: "1", name: "e" }]}
                  placeholder="select a classification..."
                  id="classification-input"
                />
              </div>
            </div>
            <div className="row">
              <div className="form__group">
                <Label className="label">Element Category</Label>

                <Select
                  className="select"
                  name="category"
                  //   onChange={(e) =>
                  //     validation.setFieldValue("industry", e.value)
                  //   }
                  options={[{ label: "one", value: "1", name: "e" }]}
                  placeholder="select Element category..."
                  id="category-input"
                />
              </div>
              <div className="form__group">
                <Label className="label">Element payrun</Label>

                <Select
                  className="select"
                  name="payrun"
                  //   onChange={(e) =>
                  //     validation.setFieldValue("industry", e.value)
                  //   }
                  options={[{ label: "one", value: "1", name: "e" }]}
                  placeholder="select Payrun..."
                  id="payrun-input"
                />
              </div>
            </div>
            <div className="row no-grid">
              <div className="form__group">
                <Label className="label">Description</Label>

                <textarea
                  className="select"
                  style={{ width: "100%", height: "10rem" }}
                  name="description"
                  //   onChange={(e) =>
                  //     validation.setFieldValue("industry", e.value)
                  //   }
                  options={[{ label: "one", value: "1", name: "e" }]}
                  placeholder="Input Description"
                  id="description-input"
                />
              </div>
            </div>
            <div className="row no-grid">
              <div className="form__group">
                <Label className="label">Reporting Name</Label>

                <textarea
                  className="select"
                  style={{ width: "100%", height: "10rem" }}
                  name="reporting"
                  //   onChange={(e) =>
                  //     validation.setFieldValue("industry", e.value)
                  //   }
                  options={[{ label: "one", value: "1", name: "e" }]}
                  placeholder="Input Reporting Name"
                  id="Reporting-input"
                />
              </div>
            </div>
            <div className="row">
              <div className="form__group">
                <div
                  onClick={() => setShowModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </div>
              </div>
              <div className="form__group">
                <div className="next-button">Next</div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Elements;
