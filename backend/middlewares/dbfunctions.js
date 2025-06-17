const client= require("../DataBase/database");
const jwt = require("jsonwebtoken");
const async = require("async");
require("./functions")();

module.exports = function (req, res) {

	this.getuserProfilefromtoken = function (accesstoken, token, callback) {
		if (isEmptyOrNull(accesstoken) || isEmptyOrNull(token)) {
			console.error("need details");
			callback(null, []);
		} else {
			try {
				var decoded = jwt.verify(token, process.env.SECRET_KEY);
				var Email = decoded.email;
				const session_id = customdecrypt(accesstoken);
				async.parallel(
					[
						// First Query: session validation
						function (callback) {
							if (isEmptyOrNull(session_id)) {
								callback(null, []);
							} else {
								client.query(`select * from sessions where session_id =$1 AND session_token =$2`, [session_id, token], function (err, data1) {
									if (err) {
										callback(err, []);
									} else if (data1.rowCount === 0) {
										callback(null, []);
									} else if (data1.rowCount === 1) {
										callback(null, data1.rows); // Correctly returning data1.rows
									} else {
										console.error('duplicate user found');
										callback(null, []);
									}
								});
							}
						},
	
						// Second Query: agent details by email
						function(callback) {
							if (isEmptyOrNull(Email)) {
								callback({ message: 'Empty Data' }, []);
							} else {
								client.query(`select * from users where user_login_email= $1`, [Email], function (err, data2) {
									if (err) {
										callback(err, []);
									} else if (data2.rowCount === 0) {
										callback(null, []);
									} else if (data2.rowCount === 1) {
										callback(null, data2.rows); // Correctly returning data2.rows
									} else {
										callback(null, []);
									}
								});
							}
						},
	
						// Third Query: session validation and user role check
						/*function (callback) {
							if (isEmptyOrNull(session_id)) {
								callback(null, []);
							} else {
								client.query(`SELECT * FROM bs_session WHERE session_id = $1 AND session_jwt = $2`, [session_id, token], function (err, data3) {
									if (err) {
										callback(err, []);
									} else if (data3.rowCount === 0) {
										callback(null, []);
									} else if (data3.rowCount === 1) {
										const userID = data3.rows[0].user_id; // Use data3, not data1
	
										client.query(`SELECT * FROM bs_agents WHERE agent_login_email = $1`, [Email], function (err, data4) {
											if (err) {
												callback(err, []);
											} else if (data4.rowCount === 0) {
												callback(null, []);
											} else if (data4.rowCount === 1) {
												const isSuperAdmin = data4.rows[0].role === 'superadmin'; // Assuming 'role' field exists in bs_agents table
	
												if (isSuperAdmin) {
													getAllServices(function (err, services) {
														if (err) {
															callback(err, []);
														} else {
															callback(null, {
																status: 200,
																message: 'All services for superadmin.',
																services: services
															});
														}
													});
												} else {
													checkUserSubscription(userID, function (err, subscription) {
														if (err) {
															callback(err, []);
														} else if (subscription === null) {
															callback(null, { status: 200, message: 'Please activate your plan.' });
														} else {
															getServicesForPlan(subscription.subscription_plan_id, function (err, services) {
																if (err) {
																	callback(err, []);
																} else if (services.length === 0) {
																	callback(null, { status: 200, message: 'No services found for this plan.' });
																} else {
																	callback(null, {
																		status: 200,
																		message: 'Access granted to related services.',
																		services: services
																	});
																}
															});
														}
													});
												}
											} else {
												callback(null, { status: 404, message: 'Duplicate agent found' });
											}
										});
									} else {
										console.error('Duplicate session found');
										callback(null, { status: 404, message: 'Duplicate session found' });
									}
								});
							}
						},*/
					],
					function (err, results) {
						if (err) {
							console.trace(err);
							sendtelegrampush("5540170932", err.message, callbackresponse);
							callback(err, []);
						} else if (results[0].length === 0) {
							callback(err, []);
						} else if (results[1].length === 0) {
							callback(err, []);
						} else {
							// Ensure data is valid before comparing
							if (results[0][0].user_id === results[1][0].user_id) { // Compare properly using first element of results
								callback(null, results);
							} else {
								callback(null, []);
							}
						}
					}
				);
			} catch (err) {
				sendtelegrampush("5540170932", err.message, callbackresponse);
				callback(err, []);
			}
		}
	};
	
	
	this.getprojectinfo = function (projectid, callback) {
		if (isEmptyOrNull(projectid)) {
			console.error("need details")
			callback(null, []);
		}
		else {
			let query = `select * from map_projects where project_id=$1 `;
			client.query(query, [projectid], async (err, projects) => {
				if (err) {
					console.trace(err.message);
					callback(e, []);
				}
				else {
					callback(null, projects.rows);
				}
			});
		}
	};
	this.getUserTotalBalance = function (userid, callback) {
		client.query(
			`SELECT coalesce((select map_balances.balance_amount from map_balances where map_balances.balance_vendorid=map_vendors.vendors_id and balance_userid =$1),0) as balance,* FROM public.map_vendors`,
			[userid],
			function (err, data2) {
				if (err) {
					sendtelegrampush("5540170932", err.message, callbackresponse);
					callback(err, { usdbal: 0, musdbal: 0 });
				} else if (data2.rowCount === 0) {
					callback(null, { usdbal: 0, musdbal: 0 });
				} else {
					let _balance = 0;
					let _balancemusd = 0;
					data2.rows.map((row, i) => {
						balance += row.balance;
					})
					_balancemusd = data2.rows.filter((row) => { return row.vendors_id == 1 })[0].balance;
					// for (let _loopvar = 0; _loopvar < data2.rows.length; _loopvar++) {
					//   if (data2.rows[_loopvar].vendors_id == 1) {
					//	 _balancemusd = data2.rows[_loopvar].balance;
					//   }
					//   _balance = _balance + data2.rows[_loopvar].vendors_usdrate * data2.rows[_loopvar].balance;
					// }
					callback(null, { usdbal: _balance, musdbal: _balancemusd });
				}
			}
		);
	};
	this.getUserVendorProjectBalance = function (userid, vendorid, projectid, callback) {
		client.query(
			`SELECT coalesce((select map_balances.balance_amount from map_balances where map_balances.balance_vendorid=map_vendors.vendors_id and balance_userid =$1 and balance_projectid = $2 LIMIT 1),0) as balance,* FROM public.map_vendors where vendors_id = $3`, [userid, projectid, vendorid], function (err, data2) {
				if (err) {
					sendtelegrampush("5540170932", err.message, callbackresponse);
					callback(err, { usdbal: 0, musdbal: 0 });
				} else if (data2.rowCount === 0) {
					callback(null, { usdbal: 0, musdbal: 0 });
				} else if (data2.rowCount === 1) {
					// let _balance = 0;
					// let _balancemusd = 0;
					// for (let _loopvar = 0; _loopvar < data2.rows.length; _loopvar++) {
					//   if (data2.rows[_loopvar].vendors_id == 1) {
					//	 _balancemusd = data2.rows[_loopvar].balance;
					//   }
					//   _balance = _balance + data2.rows[_loopvar].vendors_usdrate * data2.rows[_loopvar].balance;
					// }
					callback(null, { usdbalance: data2.rows[0].balance * data2.rows[0].vendors_usdrate, balance: data2.rows[0].balance });
				}
				else {
					callback(null, { usdbal: 0, musdbal: 0 });
				}
			}
		);
	};
	this.getaltfeeeligibility = function (userid, projectid, vendorid, transferfee, callback) {
		client.query(`select * from map_vendors where vendors_id = $1`, [vendorid], function (err, vendor) {
			if (err) {
				sendtelegrampush("5540170932", err.message, callbackresponse);
				callback(err, { status: false });
			} else if (vendor.rowCount === 0) {
				callback(null, { status: false });
			} else if (vendor.rowCount === 1) {
				client.query(`select balance_amount,balance_usdrate, balance_vendorid,balance_name from ( select * from (select balance_amount,(select vendors_usdrate from map_vendors where vendors_id =balance_vendorid ) balance_usdrate, (select vendors_vendorshortcode from map_vendors where vendors_id =balance_vendorid ) balance_name, balance_vendorid from map_balances where balance_userid = $1 and balance_projectid = $2 and balance_vendorid = ANY(ARRAY[2,3,423,5,4,378,310,94]))a order by balance_usdrate*balance_amount desc limit 1) a`, [userid, projectid], function (err, balances) {
					if (err) {
						sendtelegrampush("5540170932", err.message, callbackresponse);
						callback(err, { status: false });
					} else if (balances.rowCount === 0) {
						callback(null, { status: false });
					} else if (balances.rowCount === 1) {
						console.log(vendor.rows[0]);
						console.log(balances.rows[0]);
						console.log(vendor.rows[0].vendors_usdrate * transferfee, balances.rows[0].balance_vendorid);
						let _resultantfee = (vendor.rows[0].vendors_usdrate * transferfee) / balances.rows[0].balance_usdrate;
						if (balances.rows[0].balance_amount > _resultantfee * 2) {
							console.log({ status: true, amount: _resultantfee * 2, vendorid: balances.rows[0].balance_vendorid, vendorticker: balances.rows[0].balance_name });
							callback(null, { status: true, amount: _resultantfee * 2, vendorid: balances.rows[0].balance_vendorid, vendorticker: balances.rows[0].balance_name });
						}
						else {
							callback(null, { status: false });
						}
					} else {
						callback(null, { status: false });
					}
				});
			} else {
				callback(null, false);
			}
		});
	};
	this.getVendorInfo = function (vendorid, callback) {
		client.query(`select * FROM public.map_vendors where vendors_id = $1`, [vendorid], function (err, data2) {
			if (err) {
				sendtelegrampush("5540170932", err.message, callbackresponse);
				console.error(err);
				callback(err, null);
			}
			else if (data2.rows.length == 1) {
				callback(null, data2.rows);
			}
			else {
				callback(null, []);
			}
		}
		);
	};
	this.getVendorInfoUUID = function (vendoruuid, callback) {
		client.query(`select * FROM public.map_vendors where vendors_uuid = $1`, [vendoruuid], function (err, data2) {
			if (err) {
				sendtelegrampush("5540170932", err.message, callbackresponse);
				console.error(err);
				callback(err, null);
			}
			else if (data2.rows.length == 1) {
				callback(null, data2.rows);
			}
			else {
				callback(null, []);
			}
		});
	};
	this.addnotification = function (userid, subject, content, admin_user_id, callback) {
		client.query(
			`INSERT INTO sp_notification 
			(user_id, notification_title, notification_message, notification_read, notification_delivered_to, created_at, updated_at) 
			VALUES ($1, $2, $3, false, $4, NOW(), NOW())`,
			[userid, subject, content, admin_user_id], // ✅ Pass all 4 parameters
			function (err, data2) {
				if (err) {
					console.error("Error inserting notification:", err);
					callback(err, null);
				} else {
					console.log("Notification added successfully");
					callback(null, data2.rowCount);
				}
			}
		);
	};
	
	this.blockuserwithcomment = function (userid, comment, callback) {
		client.query(`update map_users set users_comment= users_comment ||','|| $1,users_status='Hold' where users_id= $2`,
			[comment, userid], function (err, data2) {
				if (err) {
					sendtelegrampush("5540170932", err.message, callbackresponse);
					console.error(err);
					callback(err, null);
				}
				else {
					client.query(`DELETE FROM map_session WHERE session_user_id = $1`, [userid], function (err, data2) {
						callback(err, data2.rowCount);
					});
				}
			}
		);
	};
	this.validatereferralexists = function (referralid, callback) {
		if (isEmptyOrNull(referralid)) {
			callback(null, false);
		}
		else {
			client.query(`select users_id from map_users where users_myreferralcode= $1`,
				[referralid.trim()], function (err, data2) {
					if (err) {
						sendtelegrampush("5540170932", err.message, callbackresponse);
						console.error(err);
						callback(err, false);
					}
					else {
						//console.log(data2); 
						if (data2.rowCount == 1)
							callback(err, true);
						else
							callback(err, false);
					}
				}
			);
		}
	};
};