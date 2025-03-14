import Search from "../../Components/Search";
import { TableList } from "../../Components/Layouts/TableList";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMemo } from "react";

import React, { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";

import makeApiCall from "../../utils/makeApiCall";
import { FormFeedback } from "reactstrap";

import { Label } from "reactstrap";
import RadioField from "../../Components/Layouts/Fields/RadioField";
import ToggleField from "../../Components/Layouts/Fields/ToggleField";
import TextField from "../../Components/Layouts/Fields/TextField";
import SelectField from "../../Components/Layouts/Fields/SelectField";
import { useForm } from "react-hook-form";
import { Divider, Flex, Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";

import useSWR from "swr";

import DeleteModal from "../../Components/Modules/DeleteModal";
const elCl = [
  {
    label: "Prospect",
    value: "prospect",
  },
  {
    label: "Lead",
    value: "Lead",
  },
  {
    label: "VIP Customer",
    value: "vip customer",
  },
];

const elementCategoryOptions = [
  {
    label: "Email Campaign",
    value: "Email Campaign",
  },
  {
    label: " Referral Program",
    value: " Referral Program",
  },
  {
    label: "Event Participation",
    value: "Event Participation",
  },
];

const elementPayrunOptions = [
  {
    label: "Pending",
    value: "Pending",
  },
  {
    label: "Processing",
    value: "Processing",
  },
  {
    label: "Approved",
    value: "Approved",
  },
];

const api = new makeApiCall();

const fetcher = async (url) => {
  const data = await api.get(url);

  return data;
};

function Elements() {
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [element, setElement] = useState({});

  const [errMsg, setErrorMsg] = useState("");

  const [currentTabPlane, setCurrentTabPlane] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phonebooks, setElementList] = useState([]);
  const [isSearching, setIsSearching] = useState("");

  const showDeleteModal = (item) => {
    setIsModalOpen(true);
    setElement(item);
  };

  const url = isSearching ? `element/:term?term=${isSearching}` : `element`;

  let { data, mutate, isValidating } = useSWR(url, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false, // revalidate when the page gains focus
    revalidateOnReconnect: false, // revalidate when the browser regains network connectivity
  });

  console.log(data, "ELEMENTSS");

  const handleEdit = (element) => {
    setIsUpdate(true);
    setElement(element);
    Object.keys(element).forEach((key) => {
      // setValue(key, element[key]);
    });
    setShowModal(!showModal);
  };
  const handleNextTabPlane = (id) => {
    setCurrentTabPlane(id);
  };

  const resetFlag = () => {
    setErrorMsg("");
    setIsUpdate(false);
    setShowModal(false);
    setElement({});

    setCurrentTabPlane(1);
  };

  const toggle = useCallback(() => {
    resetFlag();

    setShowModal(!showModal);
  }, [showModal]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: element?.name,
      description: element?.description,
      payRun: element?.payRun,
      classification: element?.classification,
      category: element?.category,
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Please enter a name"),
      classification: Yup.string().required("Please select a classification"),
      payRun: Yup.string().required("Please select a pay run"),
      category: Yup.string().required("Please select a category"),
      description: Yup.string().required("Please enter a description"),
    }),

    onSubmit: async (values) => {
      console.log("sisisi");
      setErrorMsg("");
      try {
        let data;
        if (isUpdate) {
          values._id = element._id;
          data = await api.put("element/", values);
        } else {
          data = await api.post("element/", values);
        }
        toast(`🚀 ${data.message}`);

        setShowModal(false);

        console.log(data, "NEW_METAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaA");

        mutate();

        // const access_token = data.access_token;
      } catch (error) {
        console.log(error, "LOGIN");
        let errMsg = error?.response?.data?.message;
        console.log(errMsg, "ERRRRRRRRRRRR");
        errMsg = errMsg || "internal server occured";
        setErrorMsg(errMsg);
        console.log(errMsg, "ER__MERSG");
      }
    },
  });

  const search = async (term) => {
    // setIsLoading(true);

    setIsSearching(term);
    // let data = await api.get(`element/:term`, {
    //   params: {
    //     term,
    //   },
    // });
    mutate(url);
    // setElementList(data.phonebook);
    // setIsLoading(false);
  };
  const handler = useCallback(
    debounce((term) => {
      if (term) search(term);
      else search();
    }, 500),
    []
  );

  const handleSearch = (e) => {
    let term = e.target.value;
    handler(term);
  };

  console.log(phonebooks, "SEARCGGGG");

  // Column
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        filterable: false,
      },

      {
        Header: "Element Classification",
        accessor: "classification",
        filterable: false,
      },

      {
        Header: "Element Category",
        accessor: "category",
      },
      {
        Header: "Pay Run",
        Cell: (cellProps) => {
          let payRun = cellProps.row.original.payRun;

          return (
            <React.Fragment>
              <div>
                {payRun === "Approved" ? (
                  <Tag color="success">{payRun}</Tag>
                ) : payRun === "Processing" ? (
                  <Tag icon={<SyncOutlined spin />} color="processing">
                    {payRun}
                  </Tag>
                ) : (
                  <Tag color="warning">{payRun}</Tag>
                )}
              </div>
            </React.Fragment>
          );
        },
      },
      {
        Header: "Date & Time Created",

        Cell: (cellProps) => {
          let date = cellProps.row.original.createdAt.split("T")[0];
          let time = cellProps.row.original.createdAt.split("T")[1];

          return (
            <React.Fragment>
              <div>
                {date} || {time?.split(".")[0]}
              </div>
            </React.Fragment>
          );
        },
      },

      {
        Header: "Description",

        Cell: (cellProps) => {
          let description = cellProps.row.original.description;

          return (
            <React.Fragment>
              <div>
                {description.length > 25
                  ? description?.slice(0, 25) + "..."
                  : description}
              </div>
            </React.Fragment>
          );
        },
      },

      {
        Header: "Actions",
        Cell: (cellProps) => {
          return (
            <React.Fragment>
              <div className="d-inline-block"></div>

              <div className="action-modal">
                <img
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleEdit(data);
                  }}
                  src="/edit.png"
                  alt=""
                />
                <img
                  onClick={() => {
                    const data = cellProps.row.original;
                    // onClickDelete(data);
                    showDeleteModal(data);
                  }}
                  src="/delete.png"
                  alt=""
                />
              </div>
            </React.Fragment>
          );
        },
      },
    ],

    []
  );

  console.log(validation.values, "VALUEESS");
  console.log(validation.errors, "VALUES__EROORR");

  return (
    <div className="elementspage">
      <div className="elementspage__container">
        <h4>Elements</h4>

        <div className="cardtableheader">
          <div className="cardtableheader__container">
            <div className="search">
              <input
                onChange={handleSearch}
                type="text"
                placeholder="search by name, pay run..."
              />
              <div className="search__button">
                <img src="/search-button.png" alt="" />
              </div>
            </div>
            <img src="/filter.png" alt="" />
          </div>

          <div onClick={() => setShowModal(true)} className="create-card">
            create element
            <img src="/plus.png" alt="" />
          </div>
        </div>

        <TableList
          columns={columns}
          data={data?.elements || []}
          isGlobalFilter={false}
          isAddUserList={false}
          customFetchData={() => 0}
          customTotalSize={4}
          customPageSize={4}
          theadClass="table-light"
        />

        {isValidating && (
          <div className="emptypagecard">
            {" "}
            <div class="loader"></div>
          </div>
        )}

        {!isValidating && !data?.elements && (
          <div className="emptypagecard">
            <img src="/empty.png" alt="" />

            <div className="emptypagecard__bottom">
              <img src="/emdanger.png" alt="" />
              <span>there are no elements to display</span>
            </div>
          </div>
        )}

        <p className="isLoading">
          {validation.isSubmitting ? "Please wait" : ""}
        </p>
      </div>

      <div
        className={`modal ${showModal ? "active" : ""}`}
        id="showModal"
        centered
      >
        <div className="modal__container">
          <div className="modal__head">
            <h4>{isUpdate ? "Update" : "Create"} Element</h4>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
            }}
          >
            <div
              className={`tabPlane ${currentTabPlane === 1 ? "active" : ""}`}
            >
              <div className="row">
                <TextField
                  name="name"
                  label="Name"
                  placeholder="input name"
                  value={validation.values.name || ""}
                  // onChange={validation.handleChange}
                  onChange={(e) => {
                    console.log(e.target.value, "EVALL");
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");

                    validation.setFieldValue(`name`, value);
                  }}
                  validation={validation}
                  onBlur={validation.handleBlur}
                />

                <SelectField
                  className="select"
                  name="classification"
                  label="Element Classification"
                  placeholder="select a classification..."
                  options={elCl}
                  value={validation.values.classification || ""}
                  onChange={validation.handleChange}
                  validation={validation}
                  onBlur={validation.handleBlur}
                />
              </div>

              <div className="row">
                <SelectField
                  className="select"
                  label="Element Category"
                  name="category"
                  options={elementCategoryOptions}
                  placeholder="select Element category..."
                  value={validation.values.category || ""}
                  onChange={validation.handleChange}
                  validation={validation}
                  onBlur={validation.handleBlur}
                />

                <SelectField
                  className="select"
                  name="payRun"
                  options={elementPayrunOptions}
                  placeholder="select Payrun..."
                  label="Element payrun"
                  value={validation.values.payRun || ""}
                  onChange={validation.handleChange}
                  validation={validation}
                  onBlur={validation.handleBlur}
                />
              </div>

              <div className="row no-grid">
                <div className="form__group">
                  <Label className="label">Description</Label>

                  <textarea
                    className="select"
                    style={{ width: "100%", height: "10rem" }}
                    name="description"
                    options={[{ label: "one", value: "1", name: "e" }]}
                    placeholder="Input Description"
                    id="description-input"
                    value={validation.values.description || ""}
                    onChange={(e) => {
                      console.log(e.target.value, "EVALL");
                      const value = e.target.value.replace(
                        /[^a-zA-Z0-9\s.,]/g,
                        ""
                      );

                      validation.setFieldValue(`description`, value);
                    }}
                    validation={validation}
                    onBlur={validation.handleBlur}
                  />

                  {validation.touched["description"] &&
                  validation.errors["description"] ? (
                    <FormFeedback type="invalid">
                      {validation.errors["description"]}
                    </FormFeedback>
                  ) : null}
                </div>
              </div>

              <div className="row">
                <div className="form__group">
                  <div onClick={() => toggle()} className="cancel-button">
                    Cancel
                  </div>
                </div>
                <div className="form__group">
                  <button type="submit" className="next-button">
                    {validation.isSubmitting
                      ? "please wait"
                      : isUpdate
                      ? "Update Element"
                      : "Create Element"}
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`tabPlane ${currentTabPlane === 3 ? "active" : ""}`}
            >
              <div className="success">
                <img src="/check.png" alt="" />
                <p>
                  Element has been {isUpdate ? "updated" : "created"}{" "}
                  successfully
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="next-button"
                  type="button"
                >
                  Close to continue
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div>
        <ToastContainer />
      </div>

      <DeleteModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        item={element}
        mutate={mutate}
      />
    </div>
  );
}

export default Elements;
