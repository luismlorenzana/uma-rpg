// Where an open world fight resumes (D283, H154): on the Scenario Gate, or on the Drills page for an open Drill.
import { drillOfNode, placeById, type Place } from '@rpg/domain'

/** The open fight's place: the one given, or the Drills' when the fight is a Drill. */
export function fightPlace(place: Place, nodeId: string | undefined): Place {
  return nodeId !== undefined && drillOfNode(nodeId) !== null ? placeById('drills') ?? place : place
}
