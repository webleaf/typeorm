import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {User} from "./entity/User";
import {expect} from "chai";

describe("github issues > #3640 Updating column values to NULL should be done in SET clasue rather than passing as query paramters for SQLite. Specially when using typeorm on mobile apps for Android as Android requires query params to not be null", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        logging: true,
        enabledDrivers: ["sqlite"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should be able to update an existing record column with a null value", () => Promise.all(connections.map(async connection => {
        const user = new User();
        user.id = 1
        user.name = "Test user"
        user.status = "active"
        // This should insert the new user
        await connection.manager.save(user);
        // Updating same user with id 1 and setting status to null. Doing it this way as strictNullChecks is set to true
        const sameUser = {
            id: 1,
            name: "Same Test user udpated name",
            status:null
        };
        // this should update the existing user with id=1 and set stauts to null.
        await connection.manager.save('User',sameUser);
        let loadedUser = await connection.manager.findOne(User, 1)
        expect(loadedUser).not.to.be.undefined;
        expect(loadedUser!.status).to.be.null;
    })));

});