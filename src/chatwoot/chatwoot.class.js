const { Console } = require('console');
const EventEmitter = require('events');
const { readFile } = require('fs/promises');
const fetch = require('node-fetch');

class ChatwootClass extends EventEmitter {
  config = {
    account: undefined,
    token: undefined,
    endpoint: undefined
}

    constructor(_config = {}) {
      super()
        if (!_config?.account) {
            throw new Error('ACCOUNT_ERROR')
        }

        if (!_config?.token) {
            throw new Error('TOKEN_ERROR')
        }

        if (!_config?.endpoint) {
            throw new Error('ENDPOINT_ERROR')
        }

        this.config = _config;
    }

    formatNumber = (number) => {
        if (!number.startsWith("+")) {
            return `+${number}`;
        }
        return number;
    }

    buildHeader = () => {
        const headers = new Headers();
        headers.append('api_access_token', this.config.token);
        headers.append('Content-Type', 'application/json');
        return headers;
    }

    buildBaseUrl = (path) => {
        return `${this.config.endpoint}/api/v1/accounts/${this.config.account}${path}`;
    }

    findContact = async (from) => {
        try {
            const url = this.buildBaseUrl(`/contacts/search?q=${from}`);
            const dataFetch = await fetch(url, {
                headers: this.buildHeader(),
                method: 'GET'
            });
            const data = await dataFetch.json();
            return data.payload[0];
        } catch (error) {
            console.error(`[Error searchByNumber]`, error);
            return [];
        }
    }

    createContact = async (dataIn = { from: '', name: '', inbox: '' }) => {
        try {
            dataIn.from = this.formatNumber(dataIn.from);

            const data = {
                inbox_id: dataIn.inbox,
                name: dataIn.name,
                phone_number: dataIn.from,
            };

            const url = this.buildBaseUrl(`/contacts`);

            const dataFetch = await fetch(url, {
                headers: this.buildHeader(),
                method: 'POST',
                body: JSON.stringify(data)
            });

            const response = await dataFetch.json();
            return response.payload.contact;
        } catch (error) {
            console.error(`[Error createContact]`, error);
            return;
        }
    }

    findOrCreateContact = async (dataIn = { from: '', name: '', inbox: '' }) => {
        try {
            dataIn.from = this.formatNumber(dataIn.from);
            const getContact = await this.findContact(dataIn.from);
            if (!getContact) {
                const contact = await this.createContact(dataIn);
                return contact;
            }
            return getContact;
        } catch (error) {
            console.error(`[Error findOrCreateContact]`, error);
            return;
        }
    }

    createConversation = async (dataIn = { inbox_id: '', contact_id: '', phone_number: '' }) => {
        try {
            dataIn.phone_number = this.formatNumber(dataIn.phone_number);

            const payload = {
                custom_attributes: { phone_number: dataIn.phone_number },
            };

            const url = this.buildBaseUrl(`/conversations`);
            const dataFetch = await fetch(url, {
                method: "POST",
                headers: this.buildHeader(),
                body: JSON.stringify({ ...dataIn, ...payload }),
            });
            const data = await dataFetch.json();
            return data;
        } catch (error) {
            console.error(`[Error createConversation]`, error);
            return;
        }
    }

    findConversation = async (dataIn = { phone_number: '' }) => {
        try {
            dataIn.phone_number = this.formatNumber(dataIn.phone_number);

            const payload = [
                {
                    attribute_key: "phone_number",
                    attribute_model: "standard",
                    filter_operator: "equal_to",
                    values: [dataIn.phone_number],
                    custom_attribute_type: "",
                },
            ];

            const url = this.buildBaseUrl(`/conversations/filter`);
            const dataFetch = await fetch(url, {
                method: "POST",
                headers: this.buildHeader(),
                body: JSON.stringify({ payload }),
            });

            const data = await dataFetch.json();
            return data.payload;
        } catch (error) {
            console.error(`[Error findConversation]`, error);
            return;
        }
    }

    findOrCreateConversation = async (dataIn = { inbox_id: '', contact_id: '', phone_number: '' }) => {
        try {
            dataIn.phone_number = this.formatNumber(dataIn.phone_number);
            const getId = await this.findConversation(dataIn);
            if (!getId.length) {
                console.log('Crear conversation');
                const conversationId = await this.createConversation(dataIn);
                return conversationId;
            }
            return getId[0];
        } catch (error) {
            console.error(`[Error findOrCreateInbox]`, error);
            return;
        }
    }

    createMessage = async (dataIn = { msg: '', mode: '', conversation_id: '', attachment: [] }) => {
        try {
            const url = this.buildBaseUrl(`/conversations/${dataIn.conversation_id}/messages`);
            const form = new FormData();
            form.set("content", dataIn.msg);
            form.set("message_type", dataIn.mode);
            form.set("private", "true");

            if (dataIn.attachment?.length) {
                const fileName = `${dataIn.attachment[0]}`.split('/').pop();
                const blob = new Blob([await readFile(dataIn.attachment[0])]);
                form.set("attachments[]", blob, fileName);
            }
            const dataFetch = await fetch(url, {
                method: "POST",
                headers: {
                    api_access_token: this.config.token
                },
                body: form
            });
            const data = await dataFetch.json();
            return data;
        } catch (error) {
            console.error(`[Error createMessage]`, error);
            return;
        }
    }

    createInbox = async (dataIn = { name: '' }) => {
        try {
            const payload = {
                name: dataIn.name,
                channel: {
                    type: "api",
                    webhook_url: "",
                },
            };

            const url = this.buildBaseUrl(`/inboxes`);
            const dataFetch = await fetch(url, {
                headers: this.buildHeader(),
                method: 'POST',
                body: JSON.stringify(payload)
            });

            const data = await dataFetch.json();
            return data;

        } catch (error) {
            console.error(`[Error createInbox]`, error);
            return;
        }
    }

    findInbox = async (dataIn = { name: '' }) => {
        try {
            const url = this.buildBaseUrl(`/inboxes`);
            const dataFetch = await fetch(url, {
                headers: this.buildHeader(),
                method: 'GET',
            });

            const data = await dataFetch.json();
            const payload = data.payload;

            const checkIfExist = payload.find((o) => o.name === dataIn.name);

            if (!checkIfExist) {
                return;
            }

            return checkIfExist;
        } catch (error) {
            console.error(`[Error findInbox]`, error);
            return;
        }
    }

    findOrCreateInbox = async (dataIn = { name: '' }) => {
        try {
            const getInbox = await this.findInbox(dataIn);
            if (!getInbox) {
                const idInbox = await this.createInbox(dataIn);
                console.log("idInbox", idInbox)
                return idInbox;
            }
            return getInbox;
        } catch (error) {
            console.error(`[Error findOrCreateInbox]`, error);
            return;
        }
    }
}

module.exports = ChatwootClass;