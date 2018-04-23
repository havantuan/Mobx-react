import React from 'react';
import {FileManager, FileNavigator} from '@opuscapita/react-filemanager';
import connectorNodeV1 from '@opuscapita/react-filemanager-connector-node-v1';
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";

@inject(Keys.fileManager)
@observer
export default class CustomFileManager extends React.Component {

  render() {
    return (
      <PageHeaderLayout title={'Quản lý tệp'}>
        <ContentHolder>
          <div style={{height: '480px', marginBottom: 16}}>
            <FileManager>
              <FileNavigator
                id="filemanager-1"
                api={connectorNodeV1.api}
                apiOptions={{
                  ...connectorNodeV1.apiOptions,
                  apiRoot: `http://opuscapita-filemanager-demo-master.azurewebsites.net/api` // Or you local Server Node V1 installation.
                }}
                capabilities={connectorNodeV1.capabilities}
                initialResourceId={'Lw'}
                listViewLayout={connectorNodeV1.listViewLayout}
                viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
                onSelectionChange={this.props.fileManager.onSelectionChange}
                onResourceChildrenChange={this.props.fileManager.onResourceChildrenChange}
              />
            </FileManager>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
