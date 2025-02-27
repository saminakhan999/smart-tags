import TagsInput from "react-tagsinput";
import Autosuggest from "react-autosuggest";
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/global.css";
import axios from "axios";

import {
  Flex,
  Field,
} from "@strapi/design-system";

const Tags = ({
  attribute,
  description,
  error,
  intlLabel,
  labelAction,
  name,
  onChange,
  required,
  value,
}) => {
  const [tags, setTags] = useState(() => {
    try {
      const values = JSON.parse(value);
      return values.map((value) => value.name.trim());
    } catch (e) {
      return [];
    }
  });
  const [suggestions, setSuggestions] = useState([]);
  let inputEle = useRef(null);

  useEffect(() => {
    document.getElementsByClassName(
      "react-autosuggest__suggestions-container"
    )[0].style.top = inputEle.current.offsetHeight + 5 + "px";

    function handleClickOutside(event) {
      if (inputEle.current && !inputEle.current.contains(event.target)) {
        document
          .getElementsByClassName("react-tagsinput")[0]
          .classList.remove("react-tagsinput--focused");
      } else {
        document
          .getElementsByClassName("react-tagsinput")[0]
          .classList.add("react-tagsinput--focused");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleTagsChange = (tags) => {
    setTags(tags);
    onChange({
      target: {
        name,
        value: JSON.stringify(tags.map((tag) => ({ name: tag.trim() }))),
        type: attribute.type,
      },
    });
  };

  const getSuggestions = async () => {
    if (!attribute.options || !attribute.options["apiUrl"]) {
      return [];
    }
    try {
      const { data } = await axios.get(attribute.options["apiUrl"]);
      const tagSuggestions = data.data ? data.data : data;

      setSuggestions(tagSuggestions);
    } catch (err) {
      console.log(err);
    }
  };

  const autocompleteRenderInput = (props) => {
    const handleOnChange = (e, { _, method }) => {
      if (method === "enter") {
        e.preventDefault();
      } else {
        props.onChange(e);
      }
    };

    const inputValue = (props.value && props.value.trim().toLowerCase()) || "";
    const inputLength = inputValue.length;

    let s = suggestions;

    if (s.length <= 0) {
      getSuggestions();
    }

    if (inputLength > 0) {
      s = s.map((tagSuggestion) => {
        const suggestionName = tagSuggestion.attributes
          ? tagSuggestion.attributes.name.trim()
          : tagSuggestion.name.trim();

        if (suggestionName.toLowerCase().slice(0, inputLength) === inputValue) {
          return {
            id: tagSuggestion.id,
            name: suggestionName,
          };
        }
        return null
      }).filter((ele) => ele !== null || ele != undefined);
    }

    return (
      <Autosuggest
        ref={props.ref}
        suggestions={s}
        shouldRenderSuggestions={(value) => value && value.trim().length > 0}
        getSuggestionValue={(s) => s.name}
        renderSuggestion={(s) => <span>{s.name}</span>}
        inputProps={{ ...props, onChange: handleOnChange }}
        onSuggestionSelected={(e, { suggestion }) => {
          props.addTag(suggestion.name);
        }}
        onSuggestionsClearRequested={() => {}}
        onSuggestionsFetchRequested={() => {}}
      />
    );
  };

  return (
    <Field.Root
      name={name}
      id={name}
      // GenericInput calls formatMessage and returns a string for the error
      error={error}
      hint={description}
      required={required}
    >
      <Flex
        direction="column"
        alignItems="stretch"
        gap={1}
        style={{
          position: `relative`,
        }}
        ref={inputEle}
      >
        <Field.Label action={labelAction}>{intlLabel}</Field.Label>
        <Flex direction="column">
          <TagsInput
            value={tags}
            onChange={handleTagsChange}
            onlyUnique={true}
            renderInput={autocompleteRenderInput}
          />
        </Flex>
        <Field.Hint />
        <Field.Error />
      </Flex>
    </Field.Root>
  );
};

Tags.defaultProps = {
  description: null,
  disabled: false,
  error: null,
  labelAction: null,
  required: false,
  value: "",
};

Tags.propTypes = {
  intlLabel: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.object,
  error: PropTypes.string,
  labelAction: PropTypes.object,
  required: PropTypes.bool,
  value: PropTypes.string,
};

export default Tags;
