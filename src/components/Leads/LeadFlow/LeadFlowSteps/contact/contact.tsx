import React, { FormEvent, useState } from "react";

import { css } from "@/utils";

import {
  IoChevronDown,
  IoLogoWhatsapp,
  IoMailOpenOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlinePersonOutline } from "react-icons/md";

import { ContactProps } from "./props";

const channels: Record<string, string> = {
  CALL: "Call",
  WHATSAPP: "WhatsApp",
  EMAIL: "Email",
  SMS: "SMS",
  CHAT: "Chat",
};

const responses: Record<string, string> = {
  INTERESTED: "Interested",
  NOT_INTERESTED: "Not Interested",
  CONTACT_LATER: "Contact Later",
};

const formatResponse = (response: string, channel: string) => {
  if (response === "CONTACT_LATER") {
    return `This client is contacted via ${channels[channel]} and asked to contact him later`;
  }
  return `This client is contacted via ${channels[channel]} and is ${responses[response]}`;
};

import { Badge, Button } from "@/components/shared";
import { useUpdateLeadContactMutation } from "@/app/services/api";

export const Contact: React.FC<ContactProps> = ({
  disabled,
  contact,
  leadId,
}) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [updateContact] = useUpdateLeadContactMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
  };

  return (
    <div className="bg-white border rounded-sm shadow-sm px-5 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <button
            className={css({ "rotate-180": isContactOpen })}
            onClick={() => setIsContactOpen(!isContactOpen)}
          >
            <IoChevronDown size={18} />
          </button>
          <p className="font-medium">Contact</p>
        </div>
        <div className="space-x-3">
          {!contact.channel && !contact.response && (
            <Button
              size="sm"
              variant={contact.contactable ? "primary" : "secondary"}
              className={css({
                "cursor-not-allowed": disabled,
              })}
              onClick={async () => {
                try {
                  await updateContact({
                    leadId,
                    contactable: !contact.contactable,
                  }).unwrap();
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              {contact.contactable ? "Uncontactable" : "Contactable"}
            </Button>
          )}
        </div>
      </div>
      {isContactOpen && (
        <div>
          <div className="flex flex-col gap-y-2 mt-4">
            <div className="flex items-center space-x-2">
              <span>
                <MdOutlinePersonOutline size={20} />
              </span>
              <span className="text-sm">{contact.name}</span>
            </div>
            {contact.mobileNumber && (
              <div className="flex items-center space-x-2">
                <span>
                  <IoLogoWhatsapp size={20} />
                </span>
                <span className="text-sm">{contact.mobileNumber}</span>
              </div>
            )}
            {contact.email && (
              <div className="flex items-center space-x-2">
                <span>
                  <IoMailOpenOutline size={20} />
                </span>
                <span className="text-sm">{contact.email}</span>
              </div>
            )}
            {contact.phoneNumber && (
              <div className="flex items-center space-x-2">
                <span>
                  <MdOutlineLocalPhone size={20} />
                </span>
                <span className="text-sm">{contact.phoneNumber}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <p className="font-medium mb-1.5">How did you contact the lead?</p>
            <div className="flex gap-x-2.5 mb-3.5 flex-wrap">
              {Object.keys(channels).map((value) => (
                <button
                  onClick={async () => {
                    try {
                      await updateContact({
                        leadId,
                        channel: value,
                      }).unwrap();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  key={value}
                  disabled={disabled}
                  className={css({ "cursor-not-allowed": disabled })}
                >
                  <Badge
                    className={css("transition-all", {
                      "opacity-60": value === contact.channel,
                    })}
                  >
                    {channels[value]}
                  </Badge>
                </button>
              ))}
            </div>
            <p className="font-medium mb-2">What was the client response?</p>
            <div className="flex gap-x-2.5 mb-3.5 flex-wrap">
              {Object.keys(responses).map((value) => (
                <button
                  className={css({
                    "cursor-not-allowed": disabled || !contact.channel,
                  })}
                  disabled={disabled || !contact.channel}
                  onClick={async () => {
                    try {
                      await updateContact({
                        leadId,
                        response: value,
                      }).unwrap();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  key={value}
                >
                  <Badge
                    className={css("transition-all", {
                      "opacity-60":
                        value === contact.response || !contact.channel,
                    })}
                  >
                    {responses[value]}
                  </Badge>
                </button>
              ))}
            </div>

            {contact.response && contact.channel && (
              <p className="py-2 px-3 rounded-lg bg-yellow-200 text-sm mt-4 mb-2">
                {formatResponse(contact.response, contact.channel)}
              </p>
            )}

            {contact.notes && (
              <div className="rounded-sm bg-yellow-100 p-3 col-span-2">
                <p className="text-sm">{contact.notes}</p>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
